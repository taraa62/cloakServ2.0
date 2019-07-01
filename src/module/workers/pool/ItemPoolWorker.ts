import {ItemWorker} from "../ItemWorker";
import {WorkerMessage} from "../WorkerMessage";
import {ItemTask} from "./ItemTask";
import {IResult} from "../../../utils/IUtils";

export class ItemPoolWorker extends ItemWorker {

    public isRun: boolean = false;
    public task: ItemTask;

    public run(task: ItemTask): void {
        if (this.isDead) return;
        this.isRun = true;
        this.task = task;
        task.run(this.key);
        this.runNewTask();
    }

    private runNewTask(): void {
        this.worker.postMessage(new WorkerMessage("init", this.task.data));
    }

    protected init(data: any): void {
        super.init(data);
        this.createListener();
    }

    private createListener(): void {
        this.addListenerWorker("online", () => {
            // if (this.task) this.task.setRunDataWorker(null, {status: "online"});
        })
        this.addListenerWorker("message", (data: WorkerMessage) => {
            if (this.task) this.task.setRunDataWorker(null, data);
            this.checkType(data.type);
        })
        this.addListenerWorker("error", (data: any) => {
            // if (this.task) this.task.setRunDataWorker(data);
            this.checkType("error");
        })
        this.addListenerWorker("exit", (data: any) => {
            // if (this.task) this.task.setRunDataWorker(data);
            this.checkType("exit");

        })
    }

    private checkType(type: string): void {
        switch (type) {
            case "end":
                this.isRun = false;
                this.parent.workerEndRun(this.key);
                break;
            case "error":
            case "exit":
                this.isRun = true;
                break;
        }
    }

    public async destroy(): Promise<IResult> {

        return super.destroy();
    }
}

