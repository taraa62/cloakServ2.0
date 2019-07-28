import {ClassKeys, ControllerConf} from "../RouteDecorator";
import {IResult} from "../../../utils/IUtils";
import {WorkerController} from "../../../submodule/donor_general/workers/WorkerController";
import {Request, Response} from "express";
import {Controller} from "./Controller";

// @RouteController.ControllersDecorator({isUse: true} as IContollerConf)


//@Controller({path: "test"} as ControllerConf)
export class TestController extends Controller {

    property = "property";
    hello: string;

    /*
        constructor(st: string) {
            const b = Reflect.getMetadata(ClassKeys.BasePath, this);

            console.log(this);
        }*/


    public async test(req: Request, res: Response, next: Function): Promise<void> {
        res.json({aa: 11});
    }


}
