import {BaseServer} from "./BaseServer";
import {FileManager} from "../utils/FileManager";
import {Http2ServerRequest, Http2ServerResponse} from "http2";
import {IResult} from "../utils/IUtils";

export class ServerHTTP2 extends BaseServer {


    protected async upServer(): Promise<IResult> {

        return new Promise<IResult>(async (res, rej) => {
            try {
                const port = this.conf.config.server.port || 8080;


                const opt = {
                    key: FileManager._fs.readFileSync(this.conf.dirProject + '/libs/https/key.pem'),
                    cert: FileManager._fs.readFileSync(this.conf.dirProject + '/libs/https/cert.pem'),
                    allowHTTP1: true,
                };


                const http2 = await require("http2");
                /*const server = http2.createSecureServer(opt);
                server.on('stream', (stream: any, headers: any) => {
                    stream.respond({
                        'content-type': 'text/html',
                        ':status': 200
                    });
                    stream.end('<h1>Hello World</h1>');
                });

                server.on('session', (session: ServerHttp2Session) => {
                   console.log('ssqws');
                });
                server.on('sessionError', (er: Error) => {
                    console.log(er);
                });


                this.server = http2.createSecureServer(opt, (request: Http2ServerRequest, response: Http2ServerResponse) => {


                });*/

                this.server = http2.createSecureServer(opt);

                this.server.listen(port, async () => {
                    this.logger.info(`serve listener post: ${port}`);
                    await require("../utils/ServerResponse");
                    res({success: true});
                });
            } catch (e) {
                rej({error: e});
            }
        })

    }
}



