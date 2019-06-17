import {MessagePort, parentPort, workerData, WorkerOptions, MessageChannel} from "worker_threads";

export class WorkerTest {

    private port: MessagePort;

    constructor() {
        console.log('create new Worker Test');


        parentPort.on("message", this.newMessage.bind(this));

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
        }else {
            this.test();
        }

    }

}

new WorkerTest();
