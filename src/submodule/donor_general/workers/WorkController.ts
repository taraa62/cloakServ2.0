import {CONTROLLERS} from "../../DonorModule";
import {DonorWorkersController} from "../../donor_workers/DonorWorkersController";
import {WorkerPoolController} from "../../../module/workers/pool/WorkerPoolController";
import {Request, Response} from "express";
import {Client} from "./Client";
import {IItemDomainInfo} from "./IClient";
import {BWorker} from "./BWorker";

export class WorkController extends BWorker {

    private poolWorkWithDonor: WorkerPoolController;


    public init(): void {
        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res);


        if (this.poolWorkWithDonor) {
            this.poolWorkWithDonor.newTask(this.parent.getWorkerHeaders().getBodyForRequestDonor(client));

        }

    }

    public getDomainConfig(): IItemDomainInfo {
        return this.parent.getOurURL();
    }


}
