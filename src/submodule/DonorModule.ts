import {BModule} from "../module/BModule";

import {DonorConfigsController} from "./donor_configs/DonorConfigsController";
import {BaseDonorController} from "./BaseDonorController";
import {WorkersModule} from "../module/workers/WorkersModule";
import {RouteModule} from "../module/route/RouteModule";
import {Request, Response} from "express";
import {IResult} from "../utils/IUtils";
import {Controller} from "../module/route/HttpControllers/Controller";
import {CloakerController} from "../module/route/HttpControllers/CloakerController";
import {ItemController} from "./donor_general/ItemController";
import {ClassUtils} from "../utils/InitDefUtils";

export class DonorModule extends BModule {

    private donorControllers: Map<String, BaseDonorController> = new Map<String, BaseDonorController>();
    private workers: WorkersModule;


    public async init(): Promise<IResult> {
        this.workers = (<WorkersModule>this.getModule('workers'));


        return super.init();
    }

    public async endInit(): Promise<IResult> {
        this.donorControllers.set('conf', new DonorConfigsController(this, this.getConfigForController("configsModule")));
        this.donorControllers.set('itemController', new ItemController(this, this.getConfigForController("itemController")));

        const initContr: IResult = await ClassUtils.initClasses(this.donorControllers).catch((er) => IResult.error(er));
        if (initContr.error) return initContr;
        this.registerRoute();
        return IResult.success;
    }

    private registerRoute(): void {
        const route: RouteModule = this.getModule('route') as RouteModule;

        route.getRoute().all("*", async (req: Request, res: Response, next: Function) => {
            await route.getController().runHttp("cloaker", req.originalUrl, req, res, next);
        })
    }

    public registerHostInController(host: string, controller: Controller): void {
        const route: RouteModule = this.getModule('route') as RouteModule;
        (<CloakerController>route.getSubControllerHttp("cloaker")).registerHOST(host, controller);
    }


    private getConfigForController(name: string): any {
        return this.subConfig[name]
    }

    public getWorkersModule(): WorkersModule {
        return this.workers;
    }

    public async destroy(): Promise<IResult> {
        return IResult.success;  //TODO destroy!!!!!
    }
}
