import {Controller} from "./Controller";
import {IResult} from "../../../utils/IUtils";

export class CloakerController extends Controller {

    //*TODO check type for controller
    private listSubController: Map<string, any>;

    public async endInit(): Promise<IResult> {
        this.listSubController = new Map<string, any>();

        return super.endInit();
    }

    registerHOST(host: string, controller: any): void {
        if (host && controller)
            this.listSubController.set(host, controller);
    }

}
