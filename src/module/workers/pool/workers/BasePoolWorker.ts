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
        this.checkCommand(data);
    }


    protected abstract resetWorker(data: any): void;

    protected async checkCommand(data: IWorkerMessage): Promise<any> {
        if (data && data.data.command) {
            const _f = (this as any)[data.data.command];
            if (_f) {
                if (_f.constructor.name == "AsyncFunction") {
                    await (_f.call(this, data) as Promise<any>).catch(er => {
                        this.logger.error(er);
                        this.sendTaskComplitError(er);
                    })
                } else {
                    _f.call(this, data);
                }
            }
        }
    }

}

