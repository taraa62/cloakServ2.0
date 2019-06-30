class ItemTask {
    private keyCurrentTask: string; //key, for stop run current task;
    private isRun: boolean = false;
    private endRunTask: Date = new Date(); //TODO !! it's not use
    private workerKey: string;

    constructor(public data: any) {

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

}
