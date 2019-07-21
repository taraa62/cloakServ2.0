/** Main to worker*/
import {EProcessEdit} from "./EGlobal";
import {IncomingHttpHeaders as Http1IncomingHttpHeaders} from "http";
import {IResult} from "../../utils/IUtils";
import {IItemDomainInfo} from "./IClient";
import {ILink, Link} from "../donor_links/Link";


export type TMessageWorkerBaseReq = {
    command: string
}

export type TMessageWorkerBaseResp = {
    error?: Error | IResult | string
}

//*  Donor request */

export type TMessageWorkerDonorReq = TMessageWorkerBaseReq & {
    options: Http1IncomingHttpHeaders;
    action: string;
    resourceFolder: string;
    isEditData: boolean;
    originalLink: ILink;
}

export type TMessageWorkerDonorResp = TMessageWorkerBaseResp & {
    pathToFile: string;
}


//* EDIT**/
export type TMessageWorkerEditTextReq = TMessageWorkerBaseReq & {
    process: EProcessEdit;
    url: string;  //req.path
    ourInfo: IItemDomainInfo;
    donorInfo: IItemDomainInfo;
    contentType: string;
    pathToFile?: string;
    text?: string;
    googleManagerID?: string;

}

/**worker to main*/
export type TMessageWorkerEditTextResp = TMessageWorkerBaseResp & {
    text?: string
    linksMap?: Map<string, ILink>;
}
