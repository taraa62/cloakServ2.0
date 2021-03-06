import {Request, Response} from "express";
import {WorkerController} from "../workers/WorkerController";
import {IItemDomainInfo} from "../../interface/IClient";
import {IResult} from "../../../utils/IUtils";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {Link} from "../../donor_links/Link";
import {RequestInfo} from "../../donor_request/RequestInfo";
import {BLogger} from "../../../module/logger/BLogger";
import * as querystring from "querystring";
import {TMessageWorkerDonorResp} from "../../interface/TMessageWorkers";

export class Client {
    public clientIp: string;
    public action: string;  //originalUrl - before edition
    public originalLink: Link;  //originalLink - link from original page
    public subHost: string = "";

    public isFile: boolean;
    public contentType: string;
    public domainInfo: IItemDomainInfo;
    public requestInfo: RequestInfo;
    private _isEditBeforeSend: boolean = false;

    private timeInitClient: number = new Date().getTime();
    private addCookieForClient: Map<string, string> = new Map<string, string>();

    constructor(public workController: WorkerController, public req: Request, public res: Response, private logger: BLogger, subhost = "") {
        this.subHost = subhost;
    }

    public async init(): Promise<IResult> {
        try {
            this.domainInfo = this.workController.getDomainConfig();
            this.subHost = this.subHost.replace(this.domainInfo.host, "");

            this.normalizeReqURL();
            const iRes: IResult = <IResult>await this.workController.workerAction.updAction(this).then(() => IResult.success).catch(er => {
                this.logger.error(er);
                IResult.error(er);
            });
            if (iRes.error) return iRes;
            this.updateContentType();
            this.checkIsEditData();
        } catch (e) {
            return IResult.error(e);
        }
        return IResult.success;
    }

    private normalizeReqURL(): void {
        const u2 = new URL(decodeURIComponent(this.domainInfo.origin + this.req.originalUrl));
        this.req.originalUrl = u2.pathname + u2.search;
    }

    private updateContentType(): void {
        this.contentType = HeadersUtils.getContentTypeFromRequest(this.req)
            || HeadersUtils.getContentTypeFromOriginalUrl(this.action)
            || HeadersUtils.getContentTypeFromOriginalUrl(this.originalLink ? this.originalLink.original : "");
    }

    public checkIsSaveFile(): boolean {
        if (this.req.method.toLocaleUpperCase() !== "GET") return false;
        if (!this.contentType) this.updateContentType();
        if (!this.contentType) return this.isFile;
        const arr = this.workController.parent.getBaseConf().maskAcceptSaveContentType.find(v => this.contentType.indexOf(v) > -1);
        return !!arr || this.isFile;
    }

    public checkIsEditData(): boolean {
        if (!this.contentType) return;
        const arr: string = this.workController.parent.getBaseConf().maskEditContentType.find(v => this.contentType.indexOf(v) > -1);
        this._isEditBeforeSend = !!arr;
        return this._isEditBeforeSend;
    }

    public get isEditBeforeSend(): boolean {
        return this._isEditBeforeSend;
    }

    public getLifeTimeClient(): number {
        return new Date().getTime() - this.timeInitClient;
    }

    public addNewCookieForClient(key: string, val: string) {
        this.addCookieForClient.set(key, val);
    }

    public generateHeaderForResponse(mess: TMessageWorkerDonorResp): void {
        this.workController.workerHeaders.getHeaderForResponseClient(this, mess);
        /*this.addCookieForClient.forEach((v, v1) => {
            this.res.cookie(v1, v);
        });*/

    }

    public getRequestBody(): string {
        if (!this.req.body || this.req.method.toLocaleUpperCase() !== "POST") return null;

        let body = (this.contentType.indexOf("form") > -1) ? querystring.stringify(this.req.body) : JSON.stringify(this.req.body);
        body = this.workController.workerHeaders.replaceStringParam(body, true);
        return body;
    }

}
