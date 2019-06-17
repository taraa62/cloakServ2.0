import {BModule} from "../BModule";
import {DefCheckerDocker} from "./DefCheckerDocker";

export class CMDUtilsModule extends BModule{

    private dockChecker:DefCheckerDocker;

    init(_wait: Function): void {
        this.dockChecker = new DefCheckerDocker(this);

        super.init(_wait);
    }

}
