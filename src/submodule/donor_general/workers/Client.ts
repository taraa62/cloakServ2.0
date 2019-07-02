import {Request, Response} from "express";
import {WorkController} from "./WorkController";
import {IItemDomainInfo} from "./IClient";

export class Client {
    public clientIp: string;
    public action: string;

    public isFile: boolean;

    public resp: Response; //response donor
    public contentType: string;
    public isSaveFile: boolean = true;
    public isEditFileBeforeSaveToDisk: boolean = true;
    public isEditTextBeforeSaveToDisk: boolean = false;
    public fileName: string;

    public domainInfo:IItemDomainInfo;

    constructor(public workController: WorkController, public req: Request, public res: Response) {
        this.domainInfo = this.workController.getDomainConfig();
        this.normalizeReqURL();
    }

    private normalizeReqURL(): void {
        // const url1:URL = new URL(this.domainInfo.origin+ + this.req.originalUrl);
        const u2 = new URL(decodeURIComponent(this.domainInfo.origin+ + this.req.originalUrl))

        this.req.originalUrl = u2.pathname + u2.search;
    }
}
