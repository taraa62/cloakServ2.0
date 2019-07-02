import {IncomingMessage} from "http";
import {IResult} from "../../../utils/IUtils";
import {WorkWithDonor} from "./WorkWithDonor";
import {BLogger} from "../../../module/logger/BLogger";
import fs from "fs";

export class WorkerFiles {

    constructor(private controller: WorkWithDonor, private logger: BLogger) {
    }


    public saveFileOnDisk(resp: IncomingMessage): Promise<IResult> {
        return new Promise<IResult>((res, rej) => {
            const name = "/home/taras/Документы/svn/cloakServ2.0/resource/test1.html"


            const writeableStream = fs.createWriteStream(name);
            writeableStream.on("finish", () => {
                res(IResult.success);
            }).on('error', (err) => {
                this.logger.error(`error write file!!!`, err);
                rej(IResult.error(err));
            });
            resp.pipe(writeableStream);
        })


    }

}
