import {ItemWorker} from "../ItemWorker";
import {WorkerMessage} from "../WorkerMessage";
import {ItemTask} from "./ItemTask";
import {IResult} from "../../../utils/IUtils";

export class ItemPoolWorker extends ItemWorker {

    public isRun: boolean = false;
    public task: ItemTask;

    private _sizeTask = 0;

    public run(task: ItemTask): void {
        if (this.isDead) return;
        this.isRun = true;
        this.task = task;
        this._sizeTask++;
        task.run(this.key);
        this.runNewTask();

    }

    private runNewTask(): void {
        this.worker.postMessage(new WorkerMessage(this.task.getKeyTask(), "init", this.task.data));
    }

    protected init(data: any): void {
        super.init(data);
        this.createListener();
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
        switch (data.type) {
            case "end":
                this._sizeTask--;
                this.task.setRunDataWorker(null, data.data);
            case "endError":
                this._sizeTask--;
                this.task.setRunDataWorker(data.data);
                break;
            case "error":
            case "exit":
                this.isRun = true;
                break;
        }
    }

    public getSizeTasks(): number {
        return this._sizeTask;
    }

    public async destroy(): Promise<IResult> {
        return super.destroy();
    }
}

