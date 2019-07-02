import {Request, Response} from "express";
import {WorkController} from "./WorkController";
import {IItemDomainInfo} from "./IClient";

export class Client {
    public clientIp: string;
    public action: string;

    public isFile: boolean;

    public contentType: string;
    public isSaveFile: boolean = true;
    public isEditFileBeforeSaveToDisk: boolean = true;
    public isEditTextBeforeSaveToDisk: boolean = false;
    public fileName: string;

    public domainInfo:IItemDomainInfo;

    constructor(public workController: WorkController, public req: Request, public res: Response) {
        this.domainInfo = this.workController.getDomainConfig();
        this.normalizeReqURL();
   //     this.initAction();
    }

    private normalizeReqURL(): void {
        const u2 = new URL(decodeURIComponent(this.domainInfo.origin+ + this.req.originalUrl))

        this.req.originalUrl = u2.pathname + u2.search;
    }

   /* private initAction(): void {
        let url = this.req.originalUrl;
        if(url.length<1)url = "/";

        if (url.endsWith("?")) {
            url = url.substr(0, url.length - 1)
        }
        if (url.endsWith("/")) {
            url += "index.html";
        }

        if (url.startsWith("/")) url = url.substr(1, url.length);



        url = url.toLocaleLowerCase();

        const act = this.getAction(url);

        console.log('dewdw')
    }*/


}
