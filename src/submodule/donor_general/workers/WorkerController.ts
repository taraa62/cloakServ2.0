import {CONTROLLERS} from "../../DonorModule";
import {DonorWorkersController} from "../../donor_workers/DonorWorkersController";
import {WorkerPoolController} from "../../../module/workers/pool/WorkerPoolController";
import {Request, Response} from "express";
import {Client} from "../item/Client";
import {IItemDomainInfo} from "../../interface/IClient";
import {BWorker} from "./BWorker";
import {IResult} from "../../../utils/IUtils";
import {EItemDomainController, EProcessEdit, EResourceFolder} from "../../interface/EGlobal";
import {WorkerHeaders} from "./WorkerHeaders";
import {DonorEditController} from "../../donor_editor/DonorEditController";
import {IMessageWorkerDonorReq, IMessageWorkerEditTextReq} from "../../interface/IMessageWorkers";
import {WorkerActions} from "./WorkerActions";

export class WorkerController extends BWorker {

    private poolWorkWithDonor: WorkerPoolController;

    public workerAction: WorkerActions;
    public workerHeaders: WorkerHeaders;
    public donorEditController: DonorEditController;


    public init(): void {
        this.workerAction = (<WorkerActions>this.parent.getWorker(EItemDomainController.ACTION));
        this.workerHeaders = (<WorkerHeaders>this.parent.getWorker(EItemDomainController.HEADER));
        this.donorEditController = <DonorEditController>this.parent.getDonorController(CONTROLLERS.EDITOR);

        this.poolWorkWithDonor = (<DonorWorkersController>this.parent.getDonorController(CONTROLLERS.WORKER_DONOR)).getPool();
    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res);
        const iRes: IResult = client.init();
        if (iRes.error) return res.status(500).send(IResult.resultToString(iRes));

        if (this.poolWorkWithDonor) {
            const donorReq: IMessageWorkerDonorReq = {
                command: "setRequest",
                options: this.workerHeaders.getBodyForRequestDonor(client),
                action: client.action,
                resourceFolder: this.getResourceFolderByContentType(client.contentType)
            };
            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq).catch(er => IResult.error(er));

            if (IResult.success) {
                const task: IMessageWorkerEditTextReq = {
                    command: "editFile",
                    url: req.path,
                    pathToFile: iRes.data.pathToFile,
                    contentType: client.contentType,
                    host: client.domainInfo.host,
                    process: EProcessEdit.POST
                };

                const iR: IResult = await this.donorEditController.getPool().newTask(task).catch(er => IResult.error(er));
                if (iR.error) res.status(404).send(IResult.resultToString(iRes));
                else {
                    res.writeHead(200, {"content-type": client.contentType});
                    res.write(iR.data.text);
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

    private getResourceFolderByContentType(ct: string): string {
        if (ct && ct.indexOf("htm") > -1) return this.parent.getResourceFolderBy(EResourceFolder.html);
        return this.parent.getResourceFolderBy(EResourceFolder.def);
    }


}
