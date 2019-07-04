/** Main to worker*/
import {EProcessEdit} from "./EGlobal";
import {IncomingHttpHeaders as Http1IncomingHttpHeaders} from "http";


export interface IMessageWorkerBaseReq {
    command: string
}

//*  Donor request */

export interface IMessageWorkerDonorReq extends IMessageWorkerBaseReq {
    options: Http1IncomingHttpHeaders;
    action: string;
    resourceFolder:string
}

export interface IMessageWorkerDonorResp {
    pathToFile: string;
}


//* EDIT**/
export interface IMessageWorkerEditTextReq extends IMessageWorkerBaseReq {
    process: EProcessEdit;
    url: string;  //req.path
    host: string;
    contentType: string;
    pathToFile?: string;
    text?: string;

}

/**worker to main*/
export interface IMessageWorkerEditTextResp {
    text?: string
    error?:any;
}
