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
        this.checkCommand(data.data);
    }


    protected abstract resetWorker(data: any): void;

    protected checkCommand(data: any): void {
        if (data && data.command) {
            const _f = (this as any)[data.command];
            if (_f && _f.constructor.name === "Function") {
                _f.call(this, data);
            }
        }
    }

}

