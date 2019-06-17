import {BaseServer} from "./BaseServer";
import {FileManager} from "../utils/FileManager";
import {Signals} from "../const/Signals";
import {RequestListener} from "http";

export class ServerHTTP2 extends BaseServer {


    protected server: any;

    protected async start(): Promise<any> {
        const isInit: boolean = await this.initModules(this.conf.getInitModuleBefore()).then((v) => true).catch((er) => false);
        if (isInit) {
            this.logger.info("all modules initialization before up server");
            const port = this.conf.config.server.port || 8080;


            const httpsHandler: RequestListener = (req: any, res: any) => {
                console.log(req.url);
                // send empty response for favicon.ico
                if (req.url === "/favicon.ico") {
                    res.writeHead(200);
                    res.end();
                    return;
                }
            };

            const opt = {
                key: FileManager._fs.readFileSync(this.conf.dirProject + '/localhost-privkey.pem'),
                cert: FileManager._fs.readFileSync(this.conf.dirProject + '/localhost-cert.pem')
            }


            const http2 = await require("http2");
            const server = http2.createSecureServer(opt);
            server.on('stream', (stream: any, headers: any) => {
                stream.respond({
                    'content-type': 'text/html',
                    ':status': 200
                });
                stream.end('<h1>Hello World</h1>');
            });


            server.listen(port, async () => {
                const isInit: boolean = await this.initModules(this.conf.getInitModuleAfter()).then((v) => true).catch((er) => false);
                if (isInit) {
                    console.log("----- all module initialization----------")
                }
            });
        }
    }
}

