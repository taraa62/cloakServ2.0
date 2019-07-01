import {Request, Response} from "express";
import {WorkController} from "./WorkController";

export class Client {
    public clientIp: string;
    public action: string;
    public url: URL;
    public isFile: boolean;

    public resp: Response; //response donor
    public contentType: string;
    public isSaveFile: boolean = true;
    public isEditFileBeforeSaveToDisk: boolean = true;
    public isEditTextBeforeSaveToDisk: boolean = false;
    public fileName: string;

    constructor(public workController:WorkController, public req: Request, public res: Response) {

    }
}
