import {RouteModule} from "./RouteModule";
import {IResult} from "../../utils/IUtils";
import {Request, Response, Router} from "express";
import {BLogger} from "../logger/BLogger";
import {Controller} from "./HttpControllers/Controller";
import {BModule} from "../BModule";
import {ClassUtils} from "../../utils/ClassUtils";
import {TestController} from "./HttpControllers/TestController";
import {EModules} from "../../server/config";
import Module = WebAssembly.Module;
import {RouteEndPoint} from "./RouteDecorator";


export class RouteController {

    private controllers: Map<string, Controller>;

    constructor(private parent: RouteModule, private route: Router, private logger: BLogger) {
        this.controllers = new Map<string, Controller>();
    }

    public async init(): Promise<IResult> {
        let iRes: IResult = IResult.success;

        try {
            this.route.all("*", async (req: Request, res: Response, next: Function) => {
                this.newRequest(req, res, next);
            });


            //  this.controllers.set("cloaker", new CloakerRouteController(this, this.logger));
         //   this.controllers.set("test", new TestController(this, this.route, this.logger));

            iRes = await ClassUtils.initClasses(this.controllers).catch(e => IResult.error(e));
            if (iRes.success) iRes = await ClassUtils.initClasses(this.controllers, "endInit").catch(e => IResult.error(e));

        } catch (e) {
            return IResult.error(e);
        }
        return iRes;
    }

    private initControllers(state: string): Promise<any>[] {
        const list: Promise<any>[] = [];

        this.controllers.forEach(v => {
            list.push((state === "init") ? v.init() : v.endInit());
        });
        return list;
    }

    public async registerNewController(host: string, moduleController: Module, ...params:any): Promise<boolean> {
        if (host && moduleController && !this.controllers.has(host)) {
            const controller: Controller = new (moduleController as any)(this, this.route, this.logger, ...params);
            let iRes: IResult = await controller.init().catch(er => IResult.error(er));
            if (iRes.error) return false;  //?
            iRes = await controller.endInit().catch(er => IResult.error(er));
            if (iRes.error) return false; //?
            return !!this.controllers.set(host, controller);
        }
        return false;
    }

    private newRequest(req: Request, res: Response, next: Function): void {
        const host: string = req.headers.host || req.host;
        if (this.controllers.has(host)) {
            const controller: any = this.controllers.get(host);
            if (controller.__routeMethod) {
                const ed: Map<string, RouteEndPoint> = controller.__routeMethod;
                //TODO check on auth!
                if (ed.has(req.url)) return ed.get(req.url).callback.call(controller, req, res, next);
                if(ed.has("*"))return ed.get("*").callback.call(controller, req, res, next);
            }
        }
        next();
    }

    public async runHttp(controller: string, action: string, req: Request, res: Response, next: Function): Promise<any> {
        // this.logger.info(action);

        if (this.controllers.has(controller)) {
            //      return await this.controllers.get(controller).run(action, req, res, next);
        } else next();
    }


    public getModule(name: EModules): BModule {
        return this.parent.getModule(name);
    }

    public getControllerHttp(name: string): Controller {
        return this.controllers.get(name);
    }

}







