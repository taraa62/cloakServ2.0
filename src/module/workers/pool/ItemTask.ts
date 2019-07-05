import {IResult} from "../../../utils/IUtils";
import {Random} from "../../../utils/Random";

export class ItemTask {
    private keyTask: string = Random.randomString(7); //key, for stop run current task;
    private isRun: boolean = false;
    private endRunTask: Date = new Date(); //TODO !! it's not use
    private workerKey: string;
    private iRes: Promise<IResult>;


    private resolve: Function;

    constructor(public data: any) {
        this.iRes = new Promise<IResult>((res) => {
            this.resolve = res;
        })
    }

    public run(workerKey: string): void {
        this.workerKey = workerKey;
        this.isRun = true;
    }

    public getWorkerKey(): string {
        return this.workerKey;
    }

    public getKeyTask(): string {
        return this.keyTask;
    }

    public isRunTask(): boolean {
        return this.isRun;
    }

    /**
     end of job a workers, and result throw here.
     */
    public setRunDataWorker(error: any = null, data: any = null): void {
        this.isRun = false;
        if (data) this.resolve(IResult.succData(data));
        else this.resolve(IResult.error(error))
    }

    public getResult(): Promise<IResult> {
        return this.iRes;
    }

}
