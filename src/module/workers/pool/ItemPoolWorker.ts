import {Random} from "../../../utils/Random";
import {ItemWorker} from "../ItemWorker";

export class ItemPoolWorker extends ItemWorker {
    public readonly key = Random.randomString();
    public isRun: boolean = false;
    public task: ItemTask;

    public run(task: ItemTask): void {
        this.task = task;
        task.run(this.key);
        this.runNewTask();
    }

    private runNewTask():void{
        this
    }
}

