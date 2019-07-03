/*
controller for work with donor.
 */
import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";


export interface IDonorWorkersControllerConfig extends IBaseDonorConfig {
    name: string
    jsFile: string
}

export class DonorWorkersController extends BaseDonorController {

    private sConf: IDonorWorkersControllerConfig;



    public async init(): Promise<IResult> {
        this.sConf = <IDonorWorkersControllerConfig>this.config;

        super.createPool(this.sConf.jsFile, this.sConf.name);

        // TestPool.testSizePool();

        return IResult.success;
    }


}
