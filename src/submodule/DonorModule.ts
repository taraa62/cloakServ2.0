import {BModule} from "../module/BModule";

import {DonorConfigsController} from "./donor_configs/DonorConfigsController";
import {BaseDonorController} from "./BaseDonorController";
import {WorkersModule} from "../module/workers/WorkersModule";
import {RouteModule} from "../module/route/RouteModule";
import {IResult} from "../utils/IUtils";
import {CloakerRouteController} from "./CloakerRouteController";
import {ItemController} from "./donor_general/ItemController";
import {DonorWorkersController} from "./donor_workers/DonorWorkersController";
import {ClassUtils} from "../utils/ClassUtils";
import {BWorker} from "./donor_general/workers/BWorker";
import {DonorEditController} from "./donor_editor/DonorEditController";
import {DonorLinksController} from "./donor_links/DonorLinksController";
import {DonorRequestController} from "./donor_request/DonorRequestController";
import {EModules} from "../server/config";


export class DonorModule extends BModule {

    private donorControllers: Map<CONTROLLERS, BaseDonorController>;
    private workers: WorkersModule;


    public async init(): Promise<IResult> {
        this.donorControllers = new Map<CONTROLLERS, BaseDonorController>();
        this.workers = (<WorkersModule>this.getModule(EModules.WORKERS));

        return super.init();
    }

    public async endInit(): Promise<IResult> {
        this.donorControllers.set(CONTROLLERS.CONFIGS, new DonorConfigsController(this, this.getConfigForController(CONTROLLERS.CONFIGS)));
        this.donorControllers.set(CONTROLLERS.WORKER_DONOR, new DonorWorkersController(this, this.getConfigForController(CONTROLLERS.WORKER_DONOR)));
        this.donorControllers.set(CONTROLLERS.LINKS, new DonorLinksController(this, this.getConfigForController(CONTROLLERS.LINKS)));
        this.donorControllers.set(CONTROLLERS.REQUEST, new DonorRequestController(this, this.getConfigForController(CONTROLLERS.REQUEST)));
        this.donorControllers.set(CONTROLLERS.ITEM, new ItemController(this, this.getConfigForController(CONTROLLERS.ITEM)));
        this.donorControllers.set(CONTROLLERS.EDITOR, new DonorEditController(this, this.getConfigForController(CONTROLLERS.EDITOR)));

        const initContr: IResult = await ClassUtils.initClasses(this.donorControllers).catch((er:Error) => IResult.error(er));
        if (initContr.error) return initContr;
        const endInit: IResult = await ClassUtils.initClasses(this.donorControllers, "endInit").catch((er:Error) => IResult.error(er));
        if (endInit.error) return endInit;

        return IResult.success;
    }


    public registerHostInController(host: string, controller:BWorker): void {
        // const route: RouteModule = this.getModule(EModules.ROUTE) as RouteModule;
        // (<CloakerRouteController>route.getSubControllerHttp("cloaker")).registerHOST(host, controller);

        (this.getModule(EModules.ROUTE) as RouteModule).getController().registerNewController(host, CloakerRouteController, controller);
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
    EDITOR = 'EDITOR',
    LINKS = 'LINKS',
    REQUEST = 'REQUEST'

}
