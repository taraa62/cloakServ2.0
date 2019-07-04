import {IMessageWorkerBaseReq} from "../../submodule/interface/IMessageWorkers";

export interface IWorkerMessage {
    key: string;
    type: string;
    data: IMessageWorkerBaseReq;

}

export class WorkerMessage implements IWorkerMessage {

    constructor(public key: string, public type: string, public data: IMessageWorkerBaseReq) {

    }
}
