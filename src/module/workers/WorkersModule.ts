import {BModule} from "../BModule";
import {ItemWorker} from "./ItemWorker";
import {WorkerOption} from "./WorkerOption";
import {IResult} from "../../utils/IUtils";
import {PoolOptions} from "./pool/PoolOptions";
import {WorkerPoolController} from "./pool/WorkerPoolController";

export class WorkersModule extends BModule {

    private listWorker: Map<string, ItemWorker> = new Map();
    private listWorkerPool: Map<string, WorkerPoolController> = new Map();


    public async init(): Promise<any> {
        /*        const confItem: IItemConfig = {
                    domain: "testDomain",
                    nameConfig: "http",
                    protocolServer: "https",
                    isRewrite: false,
                    nameServerConfD: "backend2",
                    pathToResource: "/var/test/test/test"
                };
                const res: any = await NginxUtils.createNginxConfig(confItem);
        */
        return super.init();
    }


    public addWorker(path: string, data: any, option: WorkerOption = null): ItemWorker {
        option = Object.assign(new WorkerOption(), option);
        const worker: ItemWorker = new ItemWorker(path, data, option);

        this.listWorker.set(worker.getId(), worker);
        return worker;
    }

    public async removeWorker(id: string): Promise<IResult> {
        try {
            if (this.listWorker.has(id)) {
                const iRes: IResult = await this.listWorker.get(id).destroy();
                this.listWorker.delete(id);
                if (iRes.error) return iRes;
            }
        } catch (e) {
            return {error: e};
        }
        return {success: true};
    }

    public async addPool(opt: PoolOptions): Promise<IResult> {
        if (opt.name || !this.listWorkerPool.has(opt.name)) {
            const pool: WorkerPoolController = new WorkerPoolController(this, opt);
            this.listWorkerPool.set(opt.name, pool);
            return IResult.succData(pool);
        }
        return IResult.error("the option has invalid or duplicate name for pool");
    }

    public async setTaskPool(namePool: string, data: any): Promise<IResult> {
        if (this.listWorkerPool.has(namePool)) {
            return this.listWorkerPool.get(namePool).newTask(data);
        }
        return IResult.error(`pool with name ${namePool} not fount`);
    }


}

