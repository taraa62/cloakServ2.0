import {IResult} from "../../../utils/IUtils";

export class ItemTask {
    private keyCurrentTask: string; //key, for stop run current task;
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

    public getKeyCurrentTask(): string {
        return this.keyCurrentTask;
    }

    public isRunTask(): boolean {
        return this.isRun;
    }

    /**
     end of job a worker, and result throw here.
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
