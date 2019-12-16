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
import {DonorLinksController} from "../../donor_links/DonorLinksController";
import {DonorRequestController} from "../../donor_request/DonorRequestController";
import {RequestInfo} from "../../donor_request/RequestInfo";
import FileManager from "../../../utils/FileManager";

export class WorkerController extends BWorker {

    protected poolWorkWithDonor: WorkerPoolController;

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

        const client: Client = new Client(this, req, res, this.logger);
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
        if (client.requestInfo) return this.responseFile(client, iRes.data);


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
            //  if (req.method.toLocaleUpperCase() === "POST") debugger;
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

    protected analizeResponseOfDonor(mess: TMessageWorkerDonorResp, client: Client) {
        client.generateHeaderForResponse(mess);
        const chart: number = Number(mess.respCode.toString().substr(0, 1));
        switch (chart) {
            case 1:
            case 2: {
                if (client.isFile) {
                    this.donorRequestController.createNewRequestInfo(client, mess);
                    if (client.isEditBeforeSend) {
                        this.responseData(client, mess).catch(er => this.logger.error(er));
                        // this.responseFile(client, iRes.data);
                    } else {
                        this.responseFile(client, mess);
                    }
                } else {
                    this.responseData(client, mess).catch(er => this.logger.error(er));
                }

            }
                break;
            case 3: {
                if (mess.respHeaders.location.startsWith("http")) {
                    const nLink = this.donorLinkController.checkRedirectLink(client.domainInfo.host, mess.respHeaders.location);
                    return client.res.redirect(mess.respCode, client.domainInfo.origin + nLink);
                }
                return client.res.redirect(mess.respCode, mess.respHeaders.location);
            }
            case 4:
                return this.responseError404(client);
            case 5:
                return this.responseError(client, "error500", 566);

            default:
                this.responseError(client, "undefined status code from donor", 544);
        }
    }

    protected getLinkFromOriginal(client: Client): string {
        if (client.originalLink) {
            const urlOrigin = new URL(client.originalLink.original);
            const link = `${client.domainInfo.origin}${urlOrigin.pathname}`;
            return link;
        }
        return null;
    }

    protected async responseData(client: Client, resp: TMessageWorkerDonorResp): Promise<any> {
        if (!resp) return this.responseError(client, "close");

        this.logger.info(`-----response from data / time: +${client.getLifeTimeClient()} url: ${client.req.url}`);

        if (client.isFile) {
            if (!resp.pathToFile) return this.responseError404(client);

            const task: TMessageWorkerEditTextReq = {
                command: "editFile",
                url: client.req.path,
                pathToFile: resp.pathToFile,
                contentType: client.contentType,
                ourInfo: this.getDomainConfig(),
                donorInfo: this.getDonorConfig(),
                process: EProcessEdit.PRE,
                googleManagerID: this.parent.getDomainConfig().data.googleManagerID,
                blackEditDomain: this.getBlackEditDomain(),
                blackEditSubDomain: this.getBlackEditSubDomain()
            };

            const iR: IResult = await this.donorEditController.getPool().newTask(task).catch(er => IResult.error(er));
            if (iR.error) this.responseErrorIResult(client, iR);
            else {

                if (!iR.data || !iR.data.text) debugger;
                const data: TMessageWorkerEditTextResp = iR.data;
                client.res.writeHead(200, {"content-type": client.contentType});
                client.res.write(data.text);
                client.res.end();

                if (data.linksMap) this.donorLinkController.updateNewLinks(this.workerAction, this.getDomainConfig().host, data.linksMap);
            }
        } else {
            const body: string = resp.data || ((resp.data && resp.data.data) ? resp.data.data : "");
            client.res.status(200);
            client.res.setHeader('content-length', body.length);
            client.res.write(body);
            client.res.end();
        }
    }

    protected async responseFile(client: Client, resp: TMessageWorkerDonorResp): Promise<any | void> {
        if (!resp && !client.requestInfo) return this.responseError(client, "close");
        if (!client.contentType) debugger

        const pathToFile = resp ? resp.pathToFile : client.requestInfo.pathToFile;
        const isExis = await FileManager.isExist(pathToFile);
        if (!isExis) {
            if (resp.data) {
                client.isFile = false;
                return this.responseData(client, resp);
            }
            return this.responseError404(client);
        }
        this.logger.info(`-----response from file / method: ${client.req.method} time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        if (client.isEditBeforeSend) {
            if (!resp) resp = {
                pathToFile: pathToFile,
                respCode: 200
            };
            return this.responseData(client, resp);
        }

        client.res.writeHead(200, {"content-type": client.contentType});
        FileManager._fs.createReadStream(pathToFile).pipe(client.res).on("error", (er: Error) => {

            //TODO remove file and clear request info!!!!!!!
            this.responseError(client, er.message, 533);
        });
    }

    protected responseError404(client: Client): void {
        this.logger.info(`-----response error code: 404 / method: ${client.req.method}/ time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        client.res.status(404);
    }

    protected responseError(client: Client, msg: string, code: number = 404): void {
        this.logger.info(`-----response error code: ${code}/ method: ${client.req.method} time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        client.res.status(code).send(msg);
    }

    protected responseErrorIResult(client: Client, iRes: IResult): void {
        this.logger.info(`-----response error code: 500/ method: ${client.req.method} time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        client.res.status(500).send(IResult.resultToString(iRes));
    }


    public getDomainConfig(): IItemDomainInfo {
        return this.parent.getOurURL();
    }

    public getDonorConfig(): IItemDomainInfo {
        return this.parent.getDonorURL();
    }

    protected getBlackEditDomain(): string[] {
        return this.parent.getDomainConfig().data.blackReplaceDomain;
    }

    protected getBlackEditSubDomain(): string[] {
        return this.parent.getDomainConfig().data.blackReplaceSubDomain;
    }

    protected getResourceFolderByContentType(ct: string): string {
        if (ct && ct.indexOf("htm") > -1) return this.parent.getResourceFolderBy(EResourceFolder.html);
        return this.parent.getResourceFolderBy(EResourceFolder.def);
    }


}
