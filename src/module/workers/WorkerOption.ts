import {MessagePort} from "worker_threads";

/*
 interface for Worker
 */
export interface IWorkerData {
    port?: MessagePort;
    data?: any;

}


export interface IWorkerOption {
    isMessageChannel: boolean;
}

export class WorkerOption implements IWorkerOption {
    public isMessageChannel: boolean = false;
}
