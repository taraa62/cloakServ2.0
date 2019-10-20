import {Request, Response} from "express";
import {WorkerController} from "./WorkerController";
import {Client} from "../item/Client";
import {IResult} from "../../../utils/IUtils";
import {RequestInfo} from "../../donor_request/RequestInfo";
import FileManager from "../../../utils/FileManager";
import {TMessageWorkerDonorReq} from "../../interface/TMessageWorkers";

export class WorkerSubController extends WorkerController {


    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res, this.logger, req.header("host"));
        const iRes: IResult = await client.init();
        if (iRes.error) {
            this.logger.error(iRes);
            return res.status(500).send(IResult.resultToString(iRes));
        }

        await this.donorLinkController.checkLink(client);


        const info: RequestInfo = await this.donorRequestController.checkRequest(client).catch(er => null);
        if (info) {
            if (await FileManager.isExist(info.pathToFile)) {
                client.requestInfo = info;
            } else {
                await this.donorRequestController.removeRequestInfo(client.domainInfo.host, info.action).catch(er => null);
            }
        } else {
            if (client.originalLink && client.originalLink.isRunToDonorRequest) {
                return this.responseError404(client);
            }
        }
    //    if (client.requestInfo) return this.responseFile(client, iRes.data);


        if (this.poolWorkWithDonor) {
            // if(client.action.indexOf("index.php")>-1)debugger
            const donorReq: TMessageWorkerDonorReq = {
                command: "setRequest",
                options: this.workerHeaders.getBodyForRequestDonor(client),
                action: client.action,
                resourceFolder: this.getResourceFolderByContentType(client.contentType),
                isEditData: client.isEditBeforeSend,
                originalLink: client.originalLink,
                isSave: client.checkIsSaveFile(),
                body: client.getRequestBody()
            };
            if (req.method.toLocaleUpperCase() === "POST") debugger;
            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq).catch(er => IResult.error(er));
            //    if (donorReq.action.indexOf("t64") > -1) debugger;
            if (iRes.success) {
                this.analizeResponseOfDonor(iRes.data, client);
            } else {
                this.responseError(client, IResult.resultToString(iRes), 588);
            }
        } else {
            this.responseError(client, "WorkController:error pool!", 577);
        }

    }


}
