import {BaseServer} from "./BaseServer";
import * as  http from "http";

import {IResult} from "../utils/IUtils";
import FileManager from "../utils/FileManager";

export class ServerHTTP extends BaseServer {


    protected upServer(): Promise<IResult> {

        return new Promise<IResult>((res, rej) => {
            try {
                const port = this.conf.config.server.port || 8080;

                this.server = (http.createServer as any)({
                    // key: FileManager._fs.readFileSync(FileManager.getSimplePath('./../../localhost-privkey.pem', __dirname)),
                    // cert: FileManager._fs.readFileSync(FileManager.getSimplePath('./../../localhost-cert.pem', __dirname))
                }, this.appExp);
                this.server.listen(port, async () => {
                    this.logger.info(`serve listener post: ${port}`);
                    require("../utils/ServerResponse");
                    res({success: true});
                });
            } catch (e) {
                rej({error: e});
            }
        });
    }


}

