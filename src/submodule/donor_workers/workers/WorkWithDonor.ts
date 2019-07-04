import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import https from "https";
import {AnalizationDonorResponse} from "./AnalizationDonorResponse";
import {IncomingMessage} from "http";
import {WorkerFiles} from "./WorkerFiles";
import {IMessageWorkerDonorReq} from "../../interface/IMessageWorkers";
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

    private setRequest(data: IWorkerMessage): void {
        try {
            this.logger.debug("server send to donor HTTPS->" + (<IMessageWorkerDonorReq>data.data).options.path);
            //    this.logger.debug(JSON.stringify(data.options));

            this.setHTTPS_GET(data);
        } catch (e) {
            this.sendTaskComplitError({error: e}, data.key);
        }

    }


    private setHTTPS_GET(data: IWorkerMessage): void {
        const options: IMessageWorkerDonorReq = data.data as IMessageWorkerDonorReq;
        https.get(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            this.logger.debug("donor response to server ->" + resp.headers.host);
            this.analizator.analize(resp, data);

        }).on("error", (err) => {
            super.sendTaskComplitError(err, data.key);
        });
    }
}

new WorkWithDonor();


