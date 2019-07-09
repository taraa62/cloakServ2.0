/** Main to worker*/
import {EProcessEdit} from "./EGlobal";
import {IncomingHttpHeaders as Http1IncomingHttpHeaders} from "http";
import {IResult} from "../../utils/IUtils";
import {IItemDomainInfo} from "./IClient";


export interface IMessageWorkerBaseReq {
    command: string
}

export interface IMessageWorkerBaseResp {
    error?: Error | IResult | string
}

//*  Donor request */

export interface IMessageWorkerDonorReq extends IMessageWorkerBaseReq {
    options: Http1IncomingHttpHeaders;
    action: string;
    resourceFolder: string;
    isEditData: boolean;
}

export interface IMessageWorkerDonorResp extends IMessageWorkerBaseResp {
    pathToFile: string;
}


//* EDIT**/
export interface IMessageWorkerEditTextReq extends IMessageWorkerBaseReq {
    process: EProcessEdit;
    url: string;  //req.path
    ourInfo: IItemDomainInfo;
    donorInfo: IItemDomainInfo;
    contentType: string;
    pathToFile?: string;
    text?: string;

}

/**worker to main*/
export interface IMessageWorkerEditTextResp extends IMessageWorkerBaseResp {
    text?: string

}
