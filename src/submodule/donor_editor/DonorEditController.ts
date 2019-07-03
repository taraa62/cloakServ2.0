import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {TestEditController} from "../../test/TestEditController";
import {CONTROLLERS} from "../DonorModule";
import {ItemController} from "../donor_general/ItemController";
import {DonorConfigsController} from "../donor_configs/DonorConfigsController";

export interface IDonorEditControllerConfig extends IBaseDonorConfig {
    name: string
    jsFile: string
}

export class DonorEditController extends BaseDonorController {

    private sConf: IDonorEditControllerConfig;

    public async endInit(): Promise<IResult> {

        this.sConf = <IDonorEditControllerConfig>this.config;

        const data = {
            baseConfig: await (<ItemController>this.parent.getController(CONTROLLERS.ITEM)).getBaseConfig(),
            configs: await (<DonorConfigsController>this.parent.getController(CONTROLLERS.CONFIGS)).getUseConfigs()
        }

        super.createPool(this.sConf.jsFile, this.sConf.name, data);

        // TestEditController.test1(this);
        return super.init();
    }


}
