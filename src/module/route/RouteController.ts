import {RouteModule} from "./RouteModule";
import {TestController} from "./HttpControllers/TestController";



export class RouteController {

    constructor(private parent: RouteModule) {
        this.test();
    }

    test() {
        new TestController("ffff");
    }



}







