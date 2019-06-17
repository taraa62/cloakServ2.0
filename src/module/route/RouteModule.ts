import {BModule} from "../BModule";
import {RouteController} from "./RouteController";

export class RouteModule extends BModule {

    init(_wait: Function): void {
        new RouteController(this);

        super.init(_wait);
    }
}
