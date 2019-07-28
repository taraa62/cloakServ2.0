import {Controller} from "../route/HttpControllers/Controller";
import {IResult} from "../../utils/IUtils";
import {Request, Response, Router} from "express";
import {EndPoint} from "../route/RouteDecorator";
import {EModules} from "../../server/config";
import {DonorWorkersController} from "../../submodule/donor_workers/DonorWorkersController";
import {WorkersModule} from "../workers/WorkersModule";
import {ItemTask} from "../workers/pool/ItemTask";
import {RouteController} from "../route/RouteController";
import {BLogger} from "../logger/BLogger";

export class AdminRouteController extends Controller {



    async endInit(): Promise<IResult> {


        return super.endInit();
    }

    // @ts-ignore
    @EndPoint(true, false, "/")
    private async test(req: Request, res: Response, next: Function): Promise<any> {
        res.send("saad");
    }

    // @ts-ignore
    @EndPoint(true, false, "/reqToDonor")
    private async showWorkersRequest(req: Request, res: Response, next: Function): Promise<any> {
        const task: ItemTask[] = (<WorkersModule>this.getModule(EModules.WORKERS)).getListWorkers().get("donorWorker").getRunTask();
        const aa: any = [];
        task.forEach(v => aa.push(v.data));
        res.json(JSON.stringify(aa));
    }
}
