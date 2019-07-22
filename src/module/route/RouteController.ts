import {RouteModule} from "./RouteModule";
import {IResult} from "../../utils/IUtils";
import {Request, Response} from "express";
import {BLogger} from "../logger/BLogger";
import {Controller} from "./HttpControllers/Controller";
import {BModule} from "../BModule";
import {CloakerController} from "./HttpControllers/CloakerController";
import {ClassUtils} from "../../utils/ClassUtils";


export class RouteController {

    private controllers: Map<string, Controller>;

    constructor(private parent: RouteModule, private logger: BLogger) {
        this.controllers = new Map<string, Controller>();
    }

    public async init(): Promise<IResult> {
        let iRes: IResult = IResult.success;

        try {
            this.controllers.set("cloaker", new CloakerController(this, this.logger));
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
        })
        return list;
    }


    public async runHttp(controller: string, action: string, req: Request, res: Response, next: Function): Promise<any> {
        // this.logger.info(action);

        if (this.controllers.has(controller)) {
            return await this.controllers.get(controller).run(action, req, res, next);
        } else next();
    }


    public getModule(name: string): BModule {
        return this.parent.getModule(name);
    }

    public getControllerHttp(name: string): Controller {
        return this.controllers.get(name);
    }

}







