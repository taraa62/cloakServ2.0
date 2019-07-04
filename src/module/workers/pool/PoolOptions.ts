import {ModeThread, WorkerOption} from "../WorkerOption";


export class PoolOptions {
    public mode: ModeThread = "single";
    public name: string;
    public jsFile: string;
    private _workerOption: WorkerOption;
    public initData: any = null;
    public minWorkers: number = 1;
    public maxWorkers: number = 3;
    public timeRunTask: number = 10000;

    public maxPoolTaskForUpWorker: number = 100;

    public set workerOption(opt: WorkerOption) {
        this._workerOption = Object.assign(new WorkerOption(), opt);
    }

    public get workerOption(): WorkerOption {
        return this._workerOption;
    }
}
