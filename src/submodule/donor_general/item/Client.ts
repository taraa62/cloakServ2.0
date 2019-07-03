import {Request, Response} from "express";
import {WorkerController} from "../workers/WorkerController";
import {IItemDomainInfo} from "./IClient";
import {IResult} from "../../../utils/IUtils";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {EItemDomainController} from "../workers/IWorkerGeneral";
import {WorkerActions} from "../workers/WorkerActions";

export class Client {
    public clientIp: string;
    public action: string;  //originalUrl - before edition

    public isFile: boolean;

    public contentType: string;
    public isSaveFile: boolean = true;
    public isEditFileBeforeSaveToDisk: boolean = true;
    public isEditTextBeforeSaveToDisk: boolean = false;
    public fileName: string;

    public domainInfo: IItemDomainInfo;

    constructor(public workController: WorkerController, public req: Request, public res: Response) {
    }

    public init(): IResult {
        try {
            this.domainInfo = this.workController.getDomainConfig();
            this.normalizeReqURL();

            this.contentType = HeadersUtils.getContentTypeFromRequest(this.req);
            (<WorkerActions>this.workController.parent.getWorker(EItemDomainController.ACTION)).updAction(this);
        } catch (e) {
            return IResult.error(e);
        }
        return IResult.success;
    }

    private normalizeReqURL(): void {
        const u2 = new URL(decodeURIComponent(this.domainInfo.origin + +this.req.originalUrl));

        this.req.originalUrl = u2.pathname + u2.search;
    }


}
