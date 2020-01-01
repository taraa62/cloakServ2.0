import {BaseServer} from "./BaseServer";
import {IResult} from "../utils/IUtils";
import FileManager from "../utils/FileManager";
import * as http2 from 'http2';

const fs = require('fs');
const _path = require('path');
import * as zlib from 'zlib';
import * as http from "http";

//https://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.cmc.doc/task_apionprem_gernerate_self_signed_openSSL.html

export class ServerHTTP2 extends BaseServer {

    private dF: any = {};

    protected upServer(): Promise<IResult> {

        return new Promise<IResult>(async (res, rej) => {
            try {
                const port = this.conf.config.server.port || 8080;

                const data111 = 'hello http2';
                const opt = {
                    key: FileManager._fs.readFileSync(this.conf.dirProject + '/key.pem'),
                    cert: FileManager._fs.readFileSync(this.conf.dirProject + '/certificate.pem'),
                    allowHTTP1: true,
                };

                const server = http2.createSecureServer(opt);
                server.on('error', (err) => console.error(err));

                server.on('stream', (stream, headers) => {
                    // stream is a Duplex
                    stream.respond({
                        'content-type': 'text/html',
                        ':status': 200
                    });

                    stream.end('<h1>Hello World</h1>');


                });

                server.listen(port);
            } catch (e) {
                rej({error: e});
            }
        });

    }


}

