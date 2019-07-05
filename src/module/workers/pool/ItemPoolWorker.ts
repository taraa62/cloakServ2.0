import {ItemWorker} from "../ItemWorker";
import {WorkerMessage} from "../WorkerMessage";
import {ItemTask} from "./ItemTask";
import {IResult} from "../../../utils/IUtils";

export class ItemPoolWorker extends ItemWorker {

    public isRun: boolean = false;

    private mapTask: Map<string, ItemTask>;


    protected init(data: any): void {
        this.mapTask = new Map<string, ItemTask>();
        super.init(data);
        this.createListener();
    }

    public run(task: ItemTask): void {
        if (this.isDead) return;

        this.mapTask.set(task.getKeyTask(), task);
        this.isRun = true;

        task.run(this.key);
        this.runNewTask(task);

    }

    private runNewTask(task: ItemTask): void {
        this.worker.postMessage(new WorkerMessage(task.getKeyTask(), "init", task.data));
    }

    private createListener(): void {
        this.addListenerWorker("online", () => {

            // if (this.task) this.task.setRunDataWorker(null, {status: "online"});
        });
        this.addListenerWorker("message", (data: WorkerMessage) => {
            try {
                this.checkType(data);
            } finally {
                this.isRun = false;
                this.parent.workerEndRun(this.key);
            }
            // if (this.task) this.task.setRunDataWorker(null, data.data);

        });
        this.addListenerWorker("error", (data: any) => {
            // if (this.task) this.task.setRunDataWorker(data);
            this.checkType({type: "error"} as WorkerMessage);
        });
        this.addListenerWorker("exit", (data: any) => {
            // if (this.task) this.task.setRunDataWorker(data);
            this.checkType({type: "exit"} as WorkerMessage);

        });
    }

    private checkType(data: WorkerMessage): void {
        const checkIsRunWorker = () => {
            if (this.mapTask.size > 0) this.isRun = false;
            else this.isRun = true;
        }

        switch (data.type) {
            case "end":
                if (data.key && this.mapTask.has(data.key)) {
                    this.mapTask.get(data.key).setRunDataWorker(null, data.data);
                    this.mapTask.delete(data.key);
                }
                checkIsRunWorker();
                break;
            case "endError":
                if (data.key && this.mapTask.has(data.key)) {
                    this.mapTask.get(data.key).setRunDataWorker(data.data);
                    this.mapTask.delete(data.key);
                }
                checkIsRunWorker();
                break;
            case "error":
            case "exit":
                this.isRun = true;
                if (data.key) this.mapTask.delete(data.key);
                break;
        }
    }

    public getListTasks(): ItemTask[] {
        return Array.from(this.mapTask.values());
    }

    public getSizeTasks(): number {
        return this.mapTask.size;
    }

    public async destroy(): Promise<IResult> {
        this.mapTask.clear();  //Maybe,  destroy itemTask?
        return super.destroy();
    }
}

