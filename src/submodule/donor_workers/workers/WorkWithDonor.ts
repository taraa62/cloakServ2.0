import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import https from "https";
import {AnalizationDonorResponse} from "./AnalizationDonorResponse";
import {IncomingMessage} from "http";
import {WorkerFiles} from "./WorkerFiles";


export class WorkWithDonor extends BasePoolWorker {

    public analizator: AnalizationDonorResponse;
    public workerFiles: WorkerFiles;

    protected init() {
        this.analizator = new AnalizationDonorResponse(this, this.logger);
        this.workerFiles = new WorkerFiles(this, this.logger);
    }

    protected resetWorker(data: any): void {

    }

    private setRequest(data: any): void {
        this.logger.debug("server send to donor HTTPS->" + data.options.path);
        this.logger.debug(JSON.stringify(data.options));

        this.setHTTPS_GET(data.options);
    }


    private setHTTPS_GET(opt: any): void {

        https.get(opt, (resp: IncomingMessage) => {
            this.logger.debug("donor response to server ->" + JSON.stringify(resp.headers));
            this.analizator.analize(resp);

        }).on("error", (err) => {
            super.sendTaskComplitError(err);
        });
        super.sendTaskComplitSuccess({"dse": 111})
    }
}

new WorkWithDonor();


