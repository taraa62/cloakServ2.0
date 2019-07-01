import {parentPort} from "worker_threads";
import {WorkerMessage} from "./WorkerMessage";


/*
    for extend all workers
 */
export class BaseWorker {


    constructor() {
        console.log('create new Worker Test');


        // parentPort.postMessage( {msg:"hello init"})
        parentPort.on("message", this.newMessage.bind(this));
        this.init();
    }

    protected init() {
    }


    protected newMessage(data: WorkerMessage | any): void {

    }

    protected sendMessage(type: string, mess: any): void {
        const resp = new WorkerMessage(type, mess);
        parentPort.postMessage(resp);
    }


    /*    async test() {
            await new Promise(res => {
                setTimeout((data) => {
                    console.log(data);
                    parentPort.postMessage("hello from parentPort");
                    res();
                }, 2000, "time use worker")            });

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

