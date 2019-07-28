import {BModule} from "../BModule";
import {IResult} from "../../utils/IUtils";
import {EModules} from "../../server/config";
import {RouteModule} from "../route/RouteModule";
import {AdminRouteController} from "./AdminRouteController";


export class AdminModule extends BModule {

    async endInit(): Promise<IResult> {
        (this.getModule(EModules.ROUTE) as RouteModule).getController().registerNewController(this.subConfig.registerHost, AdminRouteController)
        return super.endInit();
    }
}
