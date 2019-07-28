import {BModule} from "../BModule";
import {RouteController} from "./RouteController";
import {Request, Response, Router} from "express"
import {IResult} from "../../utils/IUtils";
import {Controller} from "./HttpControllers/Controller";


export class RouteModule extends BModule {

    private route: Router;
    private controller: RouteController;

    public async init(): Promise<IResult> {
        try {
            this.route = Router();
            this.controller = new RouteController(this, this.route, this.logger);
            const iRes: IResult = await this.controller.init().catch(e => {
                return IResult.error(e);
            });
            if (iRes.error) return iRes;



            (process as any).constant.app.appExp.use(this.route);
            return super.init();
        } catch (e) {
            return IResult.error(e);
        }
    }

    /*public getRoute(): Router {
        return this.route;
    }*/

    public getController(): RouteController {
        return this.controller;
    }

    public getSubControllerHttp(name:string):Controller {
        return this.controller.getControllerHttp(name);
    }



    public create404DefError(): void {
        this.route.use(function (req: Request, res: Response, next: Function) {
            res.status(404).send('404 page');
        });
    }

}
