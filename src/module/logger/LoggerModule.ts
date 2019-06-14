import {BModule} from "../BModule";
import {BLogger} from "./BLogger";

export class LoggerModule extends BModule {


    init(wait:Function):void {
        super.init(wait);
    }

    public getLogger(): BLogger {
        return new BLogger();
    }
}
