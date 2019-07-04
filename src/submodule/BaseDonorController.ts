import {CONTROLLERS, DonorModule} from "./DonorModule";
import {IResult} from "../utils/IUtils";
import {BLogger} from "../module/logger/BLogger";
import {PoolOptions} from "../module/workers/pool/PoolOptions";
import {FileManager} from "../utils/FileManager";
import {WorkerPoolController} from "../module/workers/pool/WorkerPoolController";
import {ModeThread} from "../module/workers/WorkerOption";

export interface IBaseDonorConfig {

}

export class BaseDonorController {

    protected logger: BLogger;
    protected pool: WorkerPoolController;


    constructor(protected parent: DonorModule, protected config: IBaseDonorConfig) {
        this.logger = parent.getLogger();
    }

    public async init(): Promise<IResult> {
        return IResult.success;
    }

    public async endInit(): Promise<IResult> {
        return IResult.success;
    }

    public getDonorController(name: CONTROLLERS): BaseDonorController {
        return this.parent.getController(name);
    }


    //********POOLS*****//
    protected async createPool(pathWorker: string, namePool: string, data: any = null, mode: ModeThread = "single"): Promise<void> {
        const poolOpt: PoolOptions = new PoolOptions();
        poolOpt.jsFile = FileManager.getSimplePath(pathWorker, __dirname);
        poolOpt.mode = mode;
        poolOpt.name = namePool;
        poolOpt.initData = data;

        const pool: IResult = await this.parent.getWorkersModule().addPool(poolOpt);

        if (pool.error) this.logger.error(pool);
        else {
            this.pool = pool.data;
        }
    }

    public getPool(): WorkerPoolController {
        return this.pool;
    }

}
