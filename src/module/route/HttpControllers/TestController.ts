import {ClassKeys, Controller, ControllerConf} from "../RouteDecorator";

// @RouteController.ControllersDecorator({isUse: true} as IContollerConf)


@Controller({path: "test"} as ControllerConf)
export class TestController {

    property = "property";
    hello: string;

    constructor(st: string) {
        const b = Reflect.getMetadata(ClassKeys.BasePath, this);

        console.log(this);
    }

}
