import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import * as https from "https";
import * as http from "http";
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
        //    if (options.action.indexOf("laticon.wo") > -1) debugger;
        delete (options.options.headers as any)['x-real-ip'];
        if (options.options.path.indexOf('/v/t51.2885-15') > -1) {
            options.options.host = options.options.hostname = "instagram.fiev18-1.fna.fbcdn.net";
            if(options.options && (options.options as any).headers && (options.options as any).headers.host){
                (options.options as any).headers.host = "instagram.fiev18-1.fna.fbcdn.net"
            }
        }
        m.get(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            // this.logger.debug("donor response to server ->" + data.key);
            // if (options.action.indexOf("t64") > -1) debugger;
            this.analizator.analize(resp, data);

        }).on("error", (err: Error) => {
            console.error(err);
            this.logger.error("donor response to server error->" + options.action);
            super.sendTaskComplitError(err, data.key);
        }).on("close", (val: any) => {
            // this.logger.debug("donor response to server close->" + data.key);
            // super.sendTaskComplitError("close", data.key);
        });
    }

    private set_POST(data: IWorkerMessage, m: any): void {
        const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;
        //    if (options.action.indexOf("laticon.wo") > -1) debugger;
        delete (options.options.headers as any)['x-real-ip'];
        (options.options.headers as any)["content-length"] = options.body.length;


        const req = m.request(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            // this.logger.debug("donor response to server ->" + data.key);
            // if (options.action.indexOf("t64") > -1) debugger;
            this.analizator.analize(resp, data);

        }).on("error", (err: Error) => {
            this.logger.debug("donor response to server error->" + options.action);
            super.sendTaskComplitError(err, data.key);
        }).on("close", (val: any) => {
            // this.logger.debug("donor response to server close->" + data.key);
            // super.sendTaskComplitError("close", data.key);
        });
        req.write(options.body);
        req.end();
    }


}

new WorkWithDonor();


