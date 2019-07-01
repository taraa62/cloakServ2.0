import {BaseWorker} from "../../BaseWorker";
import {IWorkerMessage} from "../../WorkerMessage";

export abstract class BasePoolWorker extends BaseWorker {


    protected newMessage(data: IWorkerMessage): void {
        if (data.type) {
            switch (data.type) {
                case "init":
                    this.resetWorker(data);
                    break;
            }
        }
    }


    protected abstract resetWorker(data: any): void;

}

