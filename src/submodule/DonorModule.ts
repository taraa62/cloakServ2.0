import {BModule} from "../module/BModule";

import {DonorConfigsController} from "./donor_configs/DonorConfigsController";
import {BaseDonorController} from "./BaseDonorController";
import {WorkersModule} from "../module/workers/WorkersModule";
import {RouteModule} from "../module/route/RouteModule";
import {Request, Response} from "express";
import {IResult} from "../utils/IUtils";
import {CloakerController} from "../module/route/HttpControllers/CloakerController";
import {ItemController} from "./donor_general/ItemController";
import {DonorWorkersController} from "./donor_workers/DonorWorkersController";
import {ClassUtils} from "../utils/ClassUtils";
import {WorkerController} from "./donor_general/workers/WorkerController";
import {BWorker} from "./donor_general/workers/BWorker";
import {DonorEditController} from "./donor_editor/DonorEditController";


export class DonorModule extends BModule {

    private donorControllers: Map<CONTROLLERS, BaseDonorController>;
    private workers: WorkersModule;


    public async init(): Promise<IResult> {
        this.donorControllers = new Map<CONTROLLERS, BaseDonorController>();
        this.workers = (<WorkersModule>this.getModule('workers'));

        return super.init();
    }

    public async endInit(): Promise<IResult> {
        this.donorControllers.set(CONTROLLERS.CONFIGS, new DonorConfigsController(this, this.getConfigForController(CONTROLLERS.CONFIGS)));
        this.donorControllers.set(CONTROLLERS.WORKER_DONOR, new DonorWorkersController(this, this.getConfigForController(CONTROLLERS.WORKER_DONOR)));
        this.donorControllers.set(CONTROLLERS.ITEM, new ItemController(this, this.getConfigForController(CONTROLLERS.ITEM)));
        this.donorControllers.set(CONTROLLERS.EDITOR, new DonorEditController(this, this.getConfigForController(CONTROLLERS.EDITOR)));

        const initContr: IResult = await ClassUtils.initClasses(this.donorControllers).catch((er:Error) => IResult.error(er));
        if (initContr.error) return initContr;
        const endInit: IResult = await ClassUtils.initClasses(this.donorControllers, "endInit").catch((er:Error) => IResult.error(er));
        if (endInit.error) return endInit;

        this.registerRoute();
        return IResult.success;
    }

    private registerRoute(): void {
        const route: RouteModule = this.getModule('route') as RouteModule;

        route.getRoute().all("*", async (req: Request, res: Response, next: Function) => {
            await route.getController().runHttp("cloaker", req.originalUrl, req, res, next);
        });
    }

    public registerHostInController(host: string, controller:BWorker): void {
        const route: RouteModule = this.getModule('route') as RouteModule;
        (<CloakerController>route.getSubControllerHttp("cloaker")).registerHOST(host, controller);
    }

    public getController(name: CONTROLLERS): BaseDonorController {
        return this.donorControllers.get(name);
    }

    private getConfigForController(name: CONTROLLERS): any {
        return this.subConfig[name];
    }

    public getWorkersModule(): WorkersModule {
        return this.workers;
    }

    public async destroy(): Promise<IResult> {
        return IResult.success;  //TODO destroy!!!!!
    }
}

export enum CONTROLLERS {
    CONFIGS = 'CONFIGS',
    ITEM = 'ITEM',
    WORKER_DONOR = 'WORKER_DONOR',
    EDITOR = 'EDITOR'

}
