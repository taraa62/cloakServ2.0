import {CONTROLLERS} from "../../DonorModule";
import {DonorWorkersController} from "../../donor_workers/DonorWorkersController";
import {WorkerPoolController} from "../../../module/workers/pool/WorkerPoolController";
import {Request, Response} from "express";
import {Client} from "./Client";
import {IItemDomainInfo} from "./IClient";
import {BWorker} from "./BWorker";
import {IResult} from "../../../utils/IUtils";

export class WorkController extends BWorker {

    private poolWorkWithDonor: WorkerPoolController;


    public init(): void {
        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res);


        if (this.poolWorkWithDonor) {
            const donorReq = {
                command: "setRequest",
                options: this.parent.getWorkerHeaders().getBodyForRequestDonor(client)
            }
            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq);
            if (IResult.success) {
                res.json("ok");
            }

        }

    }

    public getDomainConfig(): IItemDomainInfo {
        return this.parent.getOurURL();
    }

    public getDonorConfig(): IItemDomainInfo {
        return this.parent.getDonorURL();
    }


}
