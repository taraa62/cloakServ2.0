export interface IWorkerMessage {

    type: string;
    data: any;

}

export class WorkerMessage implements IWorkerMessage {

    constructor(public type: string, public data: any) {

    }
}
