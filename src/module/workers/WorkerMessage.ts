import {TMessageWorkerBaseReq} from "../../submodule/interface/TMessageWorkers";

export interface IWorkerMessage {
    key: string;
    type: string;
    data: TMessageWorkerBaseReq;
    dataArr?: Array<any>
}

export class WorkerMessage implements IWorkerMessage {

    constructor(public key: string, public type: string, public data: TMessageWorkerBaseReq) {

    }

}
