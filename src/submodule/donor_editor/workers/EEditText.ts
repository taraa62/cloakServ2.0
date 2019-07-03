export enum EProcessEdit {
    PRE = "PRE",
    POST = "POST"
}

/** Main to worker*/
export interface IMessageWorkerEditTextReq {
    command:string
    process: EProcessEdit;
    url: string;  //req.path
    host: string;
    contentType: string;
    pathToFile?: string;
    text?: string;

}
/**worker to main*/
export interface IMessageWorkerEditTextResp {
    text:string

}
