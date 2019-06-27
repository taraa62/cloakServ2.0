import {BModule} from "../BModule";
import {BLogger} from "./BLogger";

export class LoggerModule extends BModule {



    public getLogger(): BLogger {
        return new BLogger();
    }
}
