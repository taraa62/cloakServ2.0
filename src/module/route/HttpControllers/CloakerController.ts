import {Controller} from "./Controller";
import {IResult} from "../../../utils/IUtils";
import {Request, Response} from "express";
import {WorkController} from "../../../submodule/donor_general/workers/WorkController";

export class CloakerController extends Controller {

    //*TODO check type for controller
    private listSubController: Map<string, WorkController>;

    public async endInit(): Promise<IResult> {
        this.listSubController = new Map<string, WorkController>();

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
