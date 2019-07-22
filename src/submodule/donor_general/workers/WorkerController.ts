import {CONTROLLERS} from "../../DonorModule";
import {DonorWorkersController} from "../../donor_workers/DonorWorkersController";
import {WorkerPoolController} from "../../../module/workers/pool/WorkerPoolController";
import {Request, Response} from "express";
import {Client} from "../item/Client";
import {IItemDomainInfo} from "../../interface/IClient";
import {BWorker} from "./BWorker";
import {IResult} from "../../../utils/IUtils";
import {EItemDomainController, EProcessEdit, EResourceFolder} from "../../interface/EGlobal";
import {WorkerHeaders} from "./WorkerHeaders";
import {DonorEditController} from "../../donor_editor/DonorEditController";
import {
    TMessageWorkerDonorReq,
    TMessageWorkerDonorResp,
    TMessageWorkerEditTextReq,
    TMessageWorkerEditTextResp
} from "../../interface/TMessageWorkers";
import {WorkerActions} from "./WorkerActions";
import {FileManager} from "../../../utils/FileManager";
import {DonorLinksController} from "../../donor_links/DonorLinksController";
import {DonorRequestController} from "../../donor_request/DonorRequestController";

export class WorkerController extends BWorker {

    private poolWorkWithDonor: WorkerPoolController;

    public workerAction: WorkerActions;
    public workerHeaders: WorkerHeaders;
    public donorEditController: DonorEditController;
    public donorLinkController: DonorLinksController;
    public donorRequestController: DonorRequestController;


    public init(): void {
        this.workerAction = (<WorkerActions>this.parent.getWorker(EItemDomainController.ACTION));
        this.workerHeaders = (<WorkerHeaders>this.parent.getWorker(EItemDomainController.HEADER));
        this.donorEditController = <DonorEditController>this.parent.getDonorController(CONTROLLERS.EDITOR);
        this.donorLinkController = <DonorLinksController>this.parent.getDonorController(CONTROLLERS.LINKS);
        this.donorRequestController = <DonorRequestController>this.parent.getDonorController(CONTROLLERS.REQUEST);

        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {

        const client: Client = new Client(this, req, res);
        const iRes: IResult = client.init();
        if (iRes.error) return res.status(500).send(IResult.resultToString(iRes));

        await this.donorLinkController.checkLink(client);
        await this.donorRequestController.checkRequest(client);  //питання про те чи потрібно нам потім перевіряти на оригінальний лінк
        if (client.requestInfo) return this.responseFile(client, iRes.data);
        if (this.poolWorkWithDonor) {
            const donorReq: TMessageWorkerDonorReq = {
                command: "setRequest",
                options: this.workerHeaders.getBodyForRequestDonor(client),
                action: client.action,
                resourceFolder: this.getResourceFolderByContentType(client.contentType),
                isEditData: client.isEditBeforeSend,
                originalLink: client.originalLink
            };
            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq).catch(er => IResult.error(er));

            if (IResult.success) {
                this.donorRequestController.createNewRequestInfo(client, iRes.data as TMessageWorkerDonorResp);
                if (client.isEditBeforeSend) {
                    this.responseData(client, iRes.data).catch(er => this.logger.error(er));
                } else {
                    this.responseFile(client, iRes.data);
                }
            } else {
                this.responseError(client, IResult.resultToString(iRes), 500);
            }
        } else {
            this.responseError(client, "WorkController:error pool!", 500);
        }
    }

    private async responseData(client: Client, resp: TMessageWorkerDonorResp): Promise<any> {
        if (!resp) return this.responseError(client, "close");

        this.logger.info(`-----response from data / time: +${client.getLifeTimeClient()} url: ${client.req.url}`);


        if (!resp.pathToFile) return this.responseError404(client);

        const task: TMessageWorkerEditTextReq = {
            command: "editFile",
            url: client.req.path,
            pathToFile: resp.pathToFile,
            contentType: client.contentType,
            ourInfo: this.getDomainConfig(),
            donorInfo: this.getDonorConfig(),
            process: EProcessEdit.PRE,
            googleManagerID: this.parent.getDomainConfig().data.googleManagerID
        };

        const iR: IResult = await this.donorEditController.getPool().newTask(task).catch(er => IResult.error(er));
        if (iR.error) this.responseErrorIResult(client, iR);
        else {
            const data: TMessageWorkerEditTextResp = iR.data;
            client.res.writeHead(200, {"content-type": client.contentType});
            client.res.write(data.text);
            client.res.end();

            if (data.linksMap) this.donorLinkController.updateNewLinks(this.getDomainConfig().host, data.linksMap);
        }
    }

    private responseFile(client: Client, resp: TMessageWorkerDonorResp): void {
        if (!resp) return this.responseError(client, "close");
        this.logger.info(`-----response from file / time: +${client.getLifeTimeClient()} url: ${client.req.url}`);


        client.res.writeHead(200, {"content-type": client.contentType});
        FileManager._fs.createReadStream(resp.pathToFile).pipe(client.res).on("error", (er: Error) => {

            //TODO remove file and clear request info!!!!!!!
            this.responseError(client, er.message, 500);
        });
    }

    private responseError404(client: Client): void {
        this.logger.info(`-----response error code: 404/ time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        client.res.status(404);
    }

    private responseError(client: Client, msg: string, code: number = 404): void {
        this.logger.info(`-----response error code: ${code}/ time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        client.res.status(code).send(msg);
    }

    private responseErrorIResult(client: Client, iRes: IResult): void {
        this.logger.info(`-----response error code: 500/ time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        client.res.status(500).send(IResult.resultToString(iRes));
    }


    public getDomainConfig(): IItemDomainInfo {
        return this.parent.getOurURL();
    }

    public getDonorConfig(): IItemDomainInfo {
        return this.parent.getDonorURL();
    }

    private getResourceFolderByContentType(ct: string): string {
        if (ct && ct.indexOf("htm") > -1) return this.parent.getResourceFolderBy(EResourceFolder.html);
        return this.parent.getResourceFolderBy(EResourceFolder.def);
    }


}
