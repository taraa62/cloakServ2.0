import {Request, Response} from "express";
import {WorkerController} from "../workers/WorkerController";
import {IItemDomainInfo} from "../../interface/IClient";
import {IResult} from "../../../utils/IUtils";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {Link} from "../../donor_links/Link";

export class Client {
    public clientIp: string;
    public action: string;  //originalUrl - before edition
    public originalLink: Link;  //originalLink - link from original page

    public isFile: boolean;

    public contentType: string;

    private _isEditBeforeSend: boolean = false;

    public fileName: string;

    public domainInfo: IItemDomainInfo;


    constructor(public workController: WorkerController, public req: Request, public res: Response) {
    }

    public init(): IResult {
        try {
            this.domainInfo = this.workController.getDomainConfig();
            this.normalizeReqURL();
            this.workController.workerAction.updAction(this);
            this.contentType = HeadersUtils.getContentTypeFromRequest(this.req);
            this.checkIsEditData();
        } catch (e) {
            return IResult.error(e);
        }
        return IResult.success;
    }

    private normalizeReqURL(): void {
        const u2 = new URL(decodeURIComponent(this.domainInfo.origin + +this.req.originalUrl));

        this.req.originalUrl = u2.pathname + u2.search;
    }

    private checkIsEditData(): void {
        if (!this.contentType) return;
        const arr: Array<string> = this.workController.parent.getBaseConf().maskEditContentType.filter(v => this.contentType.indexOf(v) > -1);
        this._isEditBeforeSend = arr.length > 0;
    }

    public get isEditBeforeSend(): boolean {
        return this._isEditBeforeSend;
    }

}
