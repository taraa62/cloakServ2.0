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
import {DonorEditController} from "../../donor_editor/DonorEditController";
import {EProcessEdit, IMessageWorkerEditTextReq} from "../../donor_editor/workers/EEditText";

export class WorkerController extends BWorker {

    private poolWorkWithDonor: WorkerPoolController;


    public init(): void {
        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res);
        const iRes: IResult = client.init()
        if (this.poolWorkWithDonor) {
            const donorReq = {
                command: "setRequest",
                options: (this.parent.getWorker(EItemDomainController.HEADER) as WorkerHeaders).getBodyForRequestDonor(client)
            };
            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq);
            if (IResult.success) {
                const task: IMessageWorkerEditTextReq = {
                    command: "editFile",
                    url: "/",
                    pathToFile: "/home/taras/Документы/svn/cloakServ2.0/resource/test1.html",
                    contentType: "text/html",
                    host: "t62.com",
                    process: EProcessEdit.POST
                }
                const editContoller: DonorEditController = <DonorEditController>this.parent.getDonorController(CONTROLLERS.EDITOR);
                const iR: IResult = await editContoller.getPool().newTask(task);
                if (iRes.error) res.status(404).send(IResult.resultToString(iRes));
                else {
                    res.writeHead(200, {"content-type": "text/html"});
                    res.write(iR.data.data);
                    res.end();
                }
            } else {
                res.status(404).send(IResult.resultToString(iRes));
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
