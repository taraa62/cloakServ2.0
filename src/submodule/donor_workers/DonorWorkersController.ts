/*
controller for work with donor.
 */
import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {PoolOptions} from "../../module/workers/pool/PoolOptions";
import {FileManager} from "../../utils/FileManager";
import {WorkersModule} from "../../module/workers/WorkersModule";
import {IItemController} from "../donor_general/ItemController";


export interface IDonorWorkersController extends IBaseDonorConfig {
    name: string
    jsFile: string
}

export class DonorWorkersController extends BaseDonorController {

    private sConf: IDonorWorkersController;


    public async init(): Promise<IResult> {
        this.sConf = <IDonorWorkersController>this.config;

        this.createPool();
        return IResult.success;
    }


    private createPool(): void {
        const poolOpt: PoolOptions = new PoolOptions();
        poolOpt.jsFile = FileManager.getSimplePath(this.sConf.jsFile, __dirname);
        poolOpt.initData = {msg: "hello"};
        poolOpt.name = this.sConf.name;

        (<WorkersModule>this.parent.getModule("workers")).addPool(poolOpt);
    }

}
