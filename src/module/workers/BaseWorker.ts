import {MessagePort, parentPort, workerData} from "worker_threads";


/*
    for extend all workers
 */
export class BaseWorker {

    private port: MessagePort;

    constructor() {
        console.log('create new Worker Test');

        parentPort.on("init3", (data) => {
            console.log(data)
        });

        parentPort.postMessage( {msg:"hello init"})
        parentPort.on("message", this.newMessage.bind(this));
        this.init();
    }

    protected init() {
    }


    async test() {
        await new Promise(res => {
            setTimeout((data) => {
                console.log(data);
                parentPort.postMessage("hello from parentPort");
                res();
            }, 2000, "time use worker");
        });

    }

    private newMessage(data: any): void {

        if (data.port instanceof MessagePort) {
            this.port = data.port;
            this.port.postMessage('hello from port')
        } else {
          //  this.test();
        }

    }

}

