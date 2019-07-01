import {ItemDomain} from "../ItemDomain";
import {BLogger} from "../../../module/logger/BLogger";
import {CONTROLLERS} from "../../DonorModule";
import {DonorWorkersController} from "../../donor_workers/DonorWorkersController";
import {WorkerPoolController} from "../../../module/workers/pool/WorkerPoolController";
import {Request, Response} from "express";

export class WorkController {

    private poolWorkWithDonor: WorkerPoolController;

    constructor(private parent: ItemDomain, private logger: BLogger) {
        this.init();
    }

    private init(): void {
        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {
        //here must be to check on request info

        if(this.poolWorkWithDonor){
            // this.poolWorkWithDonor.newTask()

        }

    }

}
