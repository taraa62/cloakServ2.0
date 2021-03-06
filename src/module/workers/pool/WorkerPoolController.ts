import {WorkersModule} from "../WorkersModule";
import {ItemPoolWorker} from "./ItemPoolWorker";
import {PoolOptions} from "./PoolOptions";
import {IResult} from "../../../utils/IUtils";
import {ItemTask} from "./ItemTask";
import {BLogger} from "../../logger/BLogger";
import {Signals} from "../../../const/Signals";
import {IWorkerController} from "../WorkerOption";


/**
 *
 * для сінглетона потрібно перевіряти чи не помер запит і якщо ні, тоді пердавати воркеру.
 * незабути очистити чергу.
 */
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

    public async newTask(data: any): Promise<IResult> {
        try {
            const task: ItemTask = new ItemTask(data);
            this.awaitTasks.push(task);
            this.checkRunTask();
            return await task.getResult();
        } catch (e) {
            return IResult.error(e);
        }
    }

    private checkRunTask(): void {
        if (this.awaitTasks.length > 0) {
            if (this.opt.mode === "single") {

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
            } else {
                for (let t = 0; t < this.awaitTasks.length; t++) {
                    let worker: ItemPoolWorker;
                    for (let s of this.workers.values()) {
                        if (!s.isDead && s.isOnline) {
                            if (!worker) worker = s;
                            else {
                                if (s.getSizeTasks() < worker.getSizeTasks()) {
                                    worker = s;
                                }
                            }
                        }
                    }
                    if (worker) {
                        if (worker.getSizeTasks() > 200) {
                            this.checkListPool();
                        }
                        worker.run(this.awaitTasks.shift());
                    } else {
                        throw new Error("workers not found!!");
                    }
                }
            }
        }
    }

    private getFreeWorkers(): ItemPoolWorker[] {
        const list: ItemPoolWorker[] = [];
        for (let s of this.workers.values()) {
            if (!s.isRun && !s.isDead && s.isOnline) list.push(s);
        }
        return list;
    }

    public workerEndRun(key: string): void {
        this.checkRunTask();
    }

    public workerDead(key: string, er: number | string | Error): void {
        this.logger.error((er instanceof Error) ? er : (Number(er)) ? "workers exit with code " + er : er);
        const task: ItemTask[] = this.workers.get(key).getListTasks();
        if (task) {
            this.awaitTasks.unshift(...task);
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

    public getRunTask(): ItemTask[] {
        const key = Array.from(this.workers.keys());
        const tasks: any = [];
        key.forEach(v => {
            const arr = this.workers.get(v).getListTasks();
            tasks.push(...arr);
        });
        return tasks as ItemTask[];
    }


}






