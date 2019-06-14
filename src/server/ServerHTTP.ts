import {BaseServer} from "./BaseServer";
import http from "http";
import {Signals} from "../const/Signals";

export class ServerHTTP extends BaseServer {


    protected async start(): Promise<any> {
        const isInit: boolean = await this.initModules(this.conf.getInitModuleBefore()).then((v) => true).catch((er) => false);
        if (isInit) {
            const port = this.conf.config.server.port || 8080;

            const server = (http.createServer as any)({}, this.appExp);
            server.listen(port, async () => {
                this.logger.info(`serve listener post: ${port}`);
                require("../utils/ServerResponse");
                await this.initModules(this.conf.getInitModuleAfter()).catch((er) => {
                    process.nextTick(() => {
                        (process as any).emit(Signals.coreError, "command restart base config!!!!!");
                    });
                });
            });

        }
    }


}

