import {BaseServer} from "./BaseServer";
import http from "http";
import {Signals} from "../const/Signals";
import {IResult} from "../utils/IUtils";

export class ServerHTTP extends BaseServer {


    protected async upServer(): Promise<IResult> {

        return new Promise<IResult>((res, rej)=>{
            try {
                const port = this.conf.config.server.port || 8080;

                this.server = (http.createServer as any)({}, this.appExp);
                this.server.listen(port, async () => {
                    this.logger.info(`serve listener post: ${port}`);
                    require("../utils/ServerResponse");
                    res({success: true});
                });
            }catch (e) {
                rej({error:e})
            }
        })
    }


}

