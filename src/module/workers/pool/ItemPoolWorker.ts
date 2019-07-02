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
            this.checkType(data);
        })
        this.addListenerWorker("error", (data: any) => {
            // if (this.task) this.task.setRunDataWorker(data);
            this.checkType({type:"error"}as WorkerMessage);
        })
        this.addListenerWorker("exit", (data: any) => {
            // if (this.task) this.task.setRunDataWorker(data);
            this.checkType({type:"exit"}as WorkerMessage);

        })
    }

    private checkType(data: WorkerMessage): void {
        switch (data.type) {
            case "end":
                this.isRun = false;
                this.parent.workerEndRun(this.key);
                this.task.setRunDataWorker(null, data);
            case "endError":
                this.isRun = false;
                this.parent.workerEndRun(this.key);
                this.task.setRunDataWorker(data);
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

