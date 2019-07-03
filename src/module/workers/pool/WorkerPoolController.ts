import {WorkersModule} from "../WorkersModule";
import {ItemPoolWorker} from "./ItemPoolWorker";
import {PoolOptions} from "./PoolOptions";
import {IResult} from "../../../utils/IUtils";
import {ItemTask} from "./ItemTask";
import {BLogger} from "../../logger/BLogger";
import {Signals} from "../../../const/Signals";
import {IWorkerController} from "../WorkerOption";

export class WorkerPoolController implements IWorkerController {

    private workers: Map<string, ItemPoolWorker>;
    private awaitTasks: ItemTask[];
    private logger: BLogger;

    constructor(private parent: WorkersModule, private opt: PoolOptions) {
        this.logger = parent.getLogger();
        this.workers = new Map<string, ItemPoolWorker>();
        this.awaitTasks = [];
        this.upWorker(this.opt.minWorkers);
    }

    private upWorker(num: number) {
        for (let i = 0; i < num; i++) {
            if (this.workers.size < this.opt.maxWorkers) {
                const item: ItemPoolWorker = new ItemPoolWorker(this.opt.jsFile, this.opt.initData, this.opt.workerOption);
                item.setParent(this);
                this.workers.set(item.key, item);
            } else return;
        }
    }

    private checkListPool(): void {
        if (this.awaitTasks.length > this.workers.size) {
            this.upWorker(1);
        }
    }

    public newTask(data: any): Promise<IResult> {
        const task: ItemTask = new ItemTask(data);
        this.awaitTasks.push(task);
        this.checkRunTask();
        return task.getResult();
    }

    private checkRunTask(): void {
        if (this.awaitTasks.length > 0) {
            const list: ItemPoolWorker[] = this.getFreeWorkers();
            if (list.length >= 1) {
                for (let t = 0; t < list.length; t++) {
                    const task = this.awaitTasks.shift();
                    if (!task) return;
                    list[t].run(task);
                }
            }
            if (this.awaitTasks.length > this.opt.maxPoolTaskForUpWorker) {
                this.checkListPool();
            }
        }
    }

    private getFreeWorkers(): ItemPoolWorker[] {
        const list: ItemPoolWorker[] = [];
        for (let s of this.workers.values()) {
            if (!s.isRun) list.push(s);
        }
        return list;
    }

    public workerEndRun(key: string): void {
        this.checkRunTask();
    }

    public workerDead(key: string, er: number|string | Error): void {
        this.logger.error((er instanceof Error) ? er : (Number(er))? "workers exit with code " + er : er);
        const task: ItemTask = this.workers.get(key).task;
        if (task && task.isRunTask()) {
            this.awaitTasks.unshift(task)
        }
        this.destroyWorker(key).catch(error => this.logger.error(error));
    }

    public async destroyWorker(key: string): Promise<IResult> {
        if (this.workers.has(key)) {
            try {
                const iRes: IResult = await this.workers.get(key).destroy();
                if (iRes.error) {
                    this.logger.error(iRes);
                    process.nextTick(() => {
                        (process as any).emit(Signals.moduleError, "error destroy workers!!!!!!!!!'");
                    });
                }
            } finally {
                this.workers.delete(key);
            }
        }
        return IResult.success;
    }


}






