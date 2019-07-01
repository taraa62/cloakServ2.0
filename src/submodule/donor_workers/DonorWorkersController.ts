/*
controller for work with donor.
 */
import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {PoolOptions} from "../../module/workers/pool/PoolOptions";
import {FileManager} from "../../utils/FileManager";
import {WorkersModule} from "../../module/workers/WorkersModule";
import {WorkerPoolController} from "../../module/workers/pool/WorkerPoolController";


export interface IDonorWorkersControllerConfig extends IBaseDonorConfig {
    name: string
    jsFile: string
}

export class DonorWorkersController extends BaseDonorController {

    private sConf: IDonorWorkersControllerConfig;

    private pool: WorkerPoolController;

    public async init(): Promise<IResult> {
        this.sConf = <IDonorWorkersControllerConfig>this.config;

        this.createPool();

        // TestPool.testSizePool();

        return IResult.success;
    }


    private async createPool(): Promise<void> {
        const poolOpt: PoolOptions = new PoolOptions();
        poolOpt.jsFile = FileManager.getSimplePath(this.sConf.jsFile, __dirname);
        poolOpt.initData = {msg: "hello"};
        poolOpt.name = this.sConf.name;

        const pool: IResult = await (<WorkersModule>this.parent.getModule("workers")).addPool(poolOpt);

        if (pool.error) this.logger.error(pool);
        else {
            this.pool = pool.data;
        }
    }

    public getPool(): WorkerPoolController {
        return this.pool;
    }


}
