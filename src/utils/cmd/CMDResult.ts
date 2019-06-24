import {Random} from "../Random";

export class CMDResult {

    public readonly key: string = Random.randomString(7);


    constructor(public error: any = null, public data: any = null, public exit: number = null,
                public exitDesk: any = null, public exitCode: number = -999) {

    }
}

export enum CDMCommand{
    STOP_NGINX = "sudo systemctl stop nginx",
    START_NGINX = "sudo systemctl start nginx",
}
