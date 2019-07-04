import {parentPort, workerData} from "worker_threads";
import {WorkerMessage} from "./WorkerMessage";
import {BLogger} from "../logger/BLogger";


/*
    for extend all workers
 */
export class BaseWorker {

    protected logger: BLogger;
    protected workerData: any;

    constructor() {
        this.logger = new BLogger();
        this.logger.info('create new Worker Test');

        this.workerData = (workerData) ? workerData.data : {};
        // parentPort.postMessage( {msg:"hello init"})
        parentPort.on("message", this.newMessage.bind(this));
        this.init();
    }

    protected init() {
    }


    protected newMessage(data: WorkerMessage | any): void {

    }

    public sendTaskComplitSuccess(mess: any): void {
        const resp = new WorkerMessage("end", mess);
        parentPort.postMessage(resp);
    }

    public sendTaskComplitError(error: any): void {
        const resp = new WorkerMessage("endError", error.message || error);
        parentPort.postMessage(resp);
    }

    public sendMessage(type: string, mess: any): void {
        const resp = new WorkerMessage(type, mess);
        parentPort.postMessage(resp);
    }


    /*    async test() {
            await new Promise(res => {
                setTimeout((data) => {
                    console.log(data);
                    parentPort.postMessage("hello from parentPort");
                    res();
                }, 2000, "time use workers")            });

        }
       /* private port: MessagePort;
        private newMessage(data: any): void {

            if (data.port instanceof MessagePort) {
                this.port = data.port;
                this.port.postMessage('hello from port')
            } else {
              //  this.test();
            }

        }*/

}

