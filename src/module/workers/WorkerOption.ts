import {MessagePort} from "worker_threads";

/*
 interface for Worker
 */
export interface IWorkerData {
    port: MessagePort;
    data: any;

}


export interface IWorkerOption {
    isMessageChannel: boolean;
    event: string | symbol;
    channelEvent: string | symbol;
}

export class WorkerOption implements IWorkerOption {
    public isMessageChannel: boolean = false;
    public event: string | symbol;
    public channelEvent: string | symbol;
}
