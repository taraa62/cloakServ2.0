import {CONTROLLERS} from "../../DonorModule";
import {DonorWorkersController} from "../../donor_workers/DonorWorkersController";
import {WorkerPoolController} from "../../../module/workers/pool/WorkerPoolController";
import {Request, Response} from "express";
import {Client} from "../item/Client";
import {IItemDomainInfo} from "../item/IClient";
import {BWorker} from "./BWorker";
import {IResult} from "../../../utils/IUtils";
import {EItemDomainController} from "./IWorkerGeneral";
import {WorkerHeaders} from "./WorkerHeaders";

export class WorkerController extends BWorker {

    private poolWorkWithDonor: WorkerPoolController;


    public init(): void {
        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res);
       const iRes:IResult =  client.init()
        res.json("ok");
     /*   if (this.poolWorkWithDonor) {
            const donorReq = {
                command: "setRequest",
                options: (this.parent.getWorker(EItemDomainController.HEADER) as WorkerHeaders).getBodyForRequestDonor(client)
            };
            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq);
            if (IResult.success) {
                res.json("ok");
            }

        }*/

    }

    public getDomainConfig(): IItemDomainInfo {
        return this.parent.getOurURL();
    }

    public getDonorConfig(): IItemDomainInfo {
        return this.parent.getDonorURL();
    }


}
