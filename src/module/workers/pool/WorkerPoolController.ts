import {ItemWorker} from "../ItemWorker";
import {WorkersModule} from "../WorkersModule";
import {WorkerOption} from "../WorkerOption";
import {Random} from "../../../utils/Random";
import {ItemPoolWorker} from "./ItemPoolWorker";
import {PoolOptions} from "./PoolOptions";

export class WorkerPoolController {

    private workers: Map<string, ItemPoolWorker>;
    private awaitTasks: Set<ItemTask>;

    constructor(private parent: WorkersModule, private opt: PoolOptions) {
        this.workers = new Map<string, ItemPoolWorker>();
        this.awaitTasks = new Set<ItemTask>();
        this.upWorker(this.opt.minWorkers);
    }

    private upWorker(num: number) {
        for (let i = 0; i < num; i++) {
            if (this.workers.size < this.opt.maxWorkers) {
               // const worker: ItemWorker = new ItemWorker(this.opt.jsFile, this.opt.initData, this.opt.workerOption);
                const item: ItemPoolWorker = new ItemPoolWorker(this.opt.jsFile, this.opt.initData, this.opt.workerOption);
                this.workers.set(item.key, item);
            } else return;
        }
    }


    public async newTask(data: any): Promise<any> {
        const task: ItemTask = new ItemTask(data);


        const worker: ItemPoolWorker = this.getFreeWorker();
        if (!worker) this.awaitTasks.add(task);
        else worker.run(task);
    }

    private getFreeWorker(): ItemPoolWorker {
        for (let s of this.workers.values()) {
            if (!s.isRun) return s;
        }
        return null;
    }


}






