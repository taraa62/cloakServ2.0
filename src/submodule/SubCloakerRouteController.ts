import {Controller} from "../module/route/HttpControllers/Controller";
import {IResult} from "../utils/IUtils";
import {Request, Response, Router} from "express";
import {WorkerController} from "./donor_general/workers/WorkerController";
import {EndPoint} from "../module/route/RouteDecorator";
import {BWorker} from "./donor_general/workers/BWorker";
import {RouteController} from "../module/route/RouteController";
import {BLogger} from "../module/logger/BLogger";
import {WorkerSubController} from "./donor_general/workers/WorkerSubController";

export class SubCloakerRouteController extends Controller {


    constructor(rController: RouteController, route: Router, logger: BLogger, protected controller: BWorker) {
        super(rController, route, logger);
    }


    //*TODO check type for controller
    private listSubController: Map<string, WorkerController>;

    public async endInit(): Promise<IResult> {
        this.listSubController = new Map<string, WorkerController>();
        return super.endInit();
    }


    @EndPoint(true, false, "*")
    async run(req: Request, res: Response, next: Function): Promise<any> {
        (<WorkerSubController>this.controller).run(req, res, next);
    }



}
