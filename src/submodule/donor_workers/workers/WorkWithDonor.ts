import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import https from "https";
import http, {IncomingMessage} from "http";
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
            // this.logger.debug("server send to donor HTTPS->" + (<TMessageWorkerDonorReq>data.data).options.path);
            //    this.logger.debug(JSON.stringify(data.options));

            const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;
            if ((options.options as any).method === "GET") {
                const m = (options.options as any).protocol === "http://" ? http : https;
                delete (options.options as any).protocol;
                this.set_GET(data, m);
            } else {

            }


        } catch (e) {
            this.sendTaskComplitError({error: e}, data.key);
        }
    }


    private set_GET(data: IWorkerMessage, m: any): void {
        const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;
        // if (options.action.indexOf("t64") > -1) debugger;

        m.get(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            // this.logger.debug("donor response to server ->" + data.key);
            // if (options.action.indexOf("t64") > -1) debugger;
            this.analizator.analize(resp, data);

        }).on("error", (err: Error) => {
            this.logger.debug("donor response to server error->" + options.action);
            super.sendTaskComplitError(err, data.key);
        })
            .on("close", (val: any) => {
                // this.logger.debug("donor response to server close->" + data.key);
                // super.sendTaskComplitError("close", data.key);
            });
    }
}

new WorkWithDonor();


