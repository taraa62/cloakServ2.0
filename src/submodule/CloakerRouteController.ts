import {Controller} from "../module/route/HttpControllers/Controller";
import {IResult} from "../utils/IUtils";
import {Request, Response, Router} from "express";
import {WorkerController} from "./donor_general/workers/WorkerController";
import {EndPoint} from "../module/route/RouteDecorator";
import {BWorker} from "./donor_general/workers/BWorker";
import {RouteController} from "../module/route/RouteController";
import {BLogger} from "../module/logger/BLogger";

export class CloakerRouteController extends Controller {


    constructor(rController: RouteController, route: Router, logger: BLogger, protected controller: BWorker) {
        super(rController, route, logger);
    }


    //*TODO check type for controller
    private listSubController: Map<string, WorkerController>;

    public async endInit(): Promise<IResult> {
        this.listSubController = new Map<string, WorkerController>();
        return super.endInit();
    }

    /*registerHOST(host: string, controller: any): void {
        if (host && controller)
            this.listSubController.set(host, controller);
    }*/

    @EndPoint(true, false, "*")
    async run(req: Request, res: Response, next: Function): Promise<any> {
        (<WorkerController>this.controller).run(req, res, next);
        // if (this.listSubController.has(req.headers.host)) {
        //     this.listSubController.get(req.headers.host).run(req, res, next);
        // } else next();
    }

}
