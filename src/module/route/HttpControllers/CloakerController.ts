import {Controller} from "./Controller";
import {IResult} from "../../../utils/IUtils";
import {Request, Response} from "express";
import {WorkerController} from "../../../submodule/donor_general/workers/WorkerController";

export class CloakerController extends Controller {

    //*TODO check type for controller
    private listSubController: Map<string, WorkerController>;

    public async endInit(): Promise<IResult> {
        this.listSubController = new Map<string, WorkerController>();

        return super.endInit();
    }

    registerHOST(host: string, controller: any): void {
        if (host && controller)
            this.listSubController.set(host, controller);
    }

    async run(action: string, req: Request, res: Response, next: Function): Promise<any> {
        if (this.listSubController.has(req.headers.host)) {
            this.listSubController.get(req.headers.host).run(req, res, next);
        } else next();
    }

}
