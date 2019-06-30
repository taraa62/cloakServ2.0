import {WorkerOption} from "../WorkerOption";

export class PoolOptions {
    public name: string;
    public jsFile: string;
    private _workerOption: WorkerOption;
    public initData: any = null;
    public minWorkers: number = 1;
    public maxWorkers: number = 2;
    public timeRunTask: number;

    public set workerOption(opt: WorkerOption) {
        this._workerOption = Object.assign(new WorkerOption(), opt);
    }

    public get workerOption(): WorkerOption {
        return this._workerOption;
    }
}
