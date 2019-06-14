import {BaseServer} from "./BaseServer";
import http2 from "http2";
import {Signals} from "../const/Signals";

export class ServerHTTP2 extends BaseServer {


    protected server: any;

    protected async start(): Promise<any> {
        const isInit: boolean = await this.initModules(this.conf.getInitModuleBefore()).then((v) => true).catch((er) => false);
        if (isInit) {
            const port = this.conf.config.server.port || 8080;

            // const server = (http2.createServer as any)(this.appExp);
            const server = http2.createServer(this.appExp);
            server.listen(port, async () => {
                this.logger.info(`serve listener post: ${port}`);
                // require("../utils/ServerResponse");
                await this.initModules(this.conf.getInitModuleAfter()).catch((er) => {
                    process.nextTick(() => {
                        (process as any).emit(Signals.coreError, "command restart base config!!!!!");
                    });
                });
            });

        }

    }
}

