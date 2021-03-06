import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import * as https from "https";
import * as http from "http";
import * as http2 from "http2";
import {IncomingMessage} from "http";
import {AnalizationDonorResponse} from "./AnalizationDonorResponse";
import {WorkerFiles} from "./WorkerFiles";
import {TMessageWorkerDonorReq} from "../../interface/TMessageWorkers";
import {IWorkerMessage} from "../../../module/workers/WorkerMessage";


export class WorkWithDonor extends BasePoolWorker {

    public analizator: AnalizationDonorResponse;
    public workerFiles: WorkerFiles;

    protected init() {
        this.analizator = new AnalizationDonorResponse(this, this.logger);
        this.workerFiles = new WorkerFiles(this, this.logger);
    }

    protected resetWorker(data: IWorkerMessage): void {

    }

    //*init command
    private setRequest(data: IWorkerMessage): void {
        try {
            this.logger.debug(`server send to donor--> key: ${data.key}, path: ${(<TMessageWorkerDonorReq>data.data).options.path}`);
            //    this.logger.debug(JSON.stringify(data.options));

            const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;

         //   options.options.path = (options.options.path as string).substr(0, options.options.path.length - 1);

            const m = (options.options as any).protocol === "http://" ? http : https;
            delete (options.options as any).protocol;

            switch ((options.options as any).method) {
                case "GET": {
                    this.set_GET(data, m);
                    return;
                }
                case "POST": {
                    this.set_POST(data, m);
                    return;
                }
                default:
                    this.sendTaskComplitError({error: "method isn't GET"}, data.key);


            }

        } catch (e) {
            console.error(e);
            this.sendTaskComplitError({error: e}, data.key);
        }
    }


    private set_GET(data: IWorkerMessage, m: any): void {
        const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;
        // if (options.options && (options.options as any).headers && (options.options as any).headers.host) {
        //     if((options.options as any).path.indexOf("/?__a=")>-1){
        //         this.testpost2(data);
        //         return;
        //     }
        // }

        //    if (options.action.indexOf("laticon.wo") > -1) debugger;
        delete (options.options.headers as any)['x-real-ip'];
        /*  if (options.options.path.indexOf('/v/t51.2885-15') > -1) {
              options.options.host = options.options.hostname = "instagram.fiev18-1.fna.fbcdn.net";
              if (options.options && (options.options as any).headers && (options.options as any).headers.host) {
                  (options.options as any).headers.host = "instagram.fiev18-1.fna.fbcdn.net";
              }
          }*/

        // if((options.options as any).path.indexOf("/?__a=")>-1) {
        //     (options.options as any).path =
        //         (options.options as any).path.substr(0,options.options.path.indexOf("/?__a=")+ "/?__a=".length+1)
        // }


        m.get(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            // this.logger.debug("donor response to server ->" + data.key);
            // if (options.action.indexOf("t64") > -1) debugger;
            data.isRequestEnd = true;
            this.analizator.analize(resp, data);

        }).on("error", (err: Error) => {
            console.error(err);
            this.logger.error("donor response to server error->" + options.action);
            data.isRequestEnd = true;
            super.sendTaskComplitError(err, data.key);
        }).on("close", (val: any) => {
            // this.logger.debug("donor response to server close->" + data.key);
            if (!data.isRequestEnd) super.sendTaskComplitError("close", data.key);

        });
    }

    private set_POST(data: IWorkerMessage, m: any): void {
        const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;
        //    if (options.action.indexOf("laticon.wo") > -1) debugger;
        delete (options.options.headers as any)['x-real-ip'];
        (options.options.headers as any)["content-length"] = options.body.length;
        // (options.options.headers as any)['accept-encoding'] = 'gzip, deflate';
        // (options.options.headers as any)['accept-language'] = 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7';
        // options.options.path = options.action;

        const req = m.request(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            // this.logger.debug("donor response to server ->" + data.key);
            // if (options.action.indexOf("t64") > -1) debugger;
            data.isRequestEnd = true;
            this.analizator.analize(resp, data);

        }).on("error", (err: Error) => {
            this.logger.debug("donor response to server error->" + options.action);
            data.isRequestEnd = true;
            super.sendTaskComplitError(err, data.key);
        }).on("close", (val: any) => {
            // this.logger.debug("donor response to server close->" + data.key);
            // super.sendTaskComplitError("close", data.key);
            if (!data.isRequestEnd) super.sendTaskComplitError("close", data.key);
        });
        req.write(options.body);
        req.end();
    }

    private async testpost2(data: IWorkerMessage) {
        const client = http2.connect('https://www.instagram.com');

        /*client.on('stream', (pushedStream, requestHeaders) => {
            pushedStream.on('push', (responseHeaders) => {
                // Process response headers
            });
            pushedStream.on('data', (chunk) => {
                console.log(1111);
            });
        });*/

        client.on('error', (err) => console.error(err));

        const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;

        delete options.options.host;
        delete options.options.hostname;


        const req = client.request({
            ':authority': (options.options.headers as any).host,
            ':method': 'GET',
            ':scheme': 'https',
            ':path':'/explore/tags/puppiesofinstgram/?__a=1',
            ...options.options
        }, {endStream: false});

        let dataArr = '';
        req.once('data', (chunk) => {
            dataArr += chunk;
        });
        req.once('end', () => {
            console.log(`\n${dataArr}`);
            // req.close();
            // client.close();
        });
        // req.write(options.body);
        req.end(options.body);
    }
}

new WorkWithDonor();


