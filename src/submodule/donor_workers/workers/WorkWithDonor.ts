import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import https from "https";
import {AnalizationDonorResponse} from "./AnalizationDonorResponse";
import {IncomingMessage} from "http";
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
            this.logger.debug("server send to donor HTTPS->" + (<TMessageWorkerDonorReq>data.data).options.path);
            //    this.logger.debug(JSON.stringify(data.options));


            this.setHTTPS_GET(data);
        } catch (e) {
            this.sendTaskComplitError({error: e}, data.key);
        }
    }


    private setHTTPS_GET(data: IWorkerMessage): void {
        const options: TMessageWorkerDonorReq = data.data as TMessageWorkerDonorReq;

        https.get(options.options, (resp: IncomingMessage) => {
            // this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            this.logger.debug("donor response to server ->" + resp.headers);
            this.analizator.analize(resp, data);

        }).on("error", (err) => {
            this.logger.debug("donor response to server error->" );
            super.sendTaskComplitError(err, data.key);
        }).on("close", (val:any)=>{
            this.logger.debug("donor response to server close->" );
            super.sendTaskComplitError("close", data.key);
        })
    }
}

new WorkWithDonor();


