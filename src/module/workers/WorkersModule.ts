import {BModule} from "../BModule";
import {MessageChannel, Worker} from "worker_threads";

export class WorkersModule extends BModule {

    private worker: Worker;

    init(wait: Function): void {
        this.worker = new Worker(__dirname + "/WorkerTest.js");
        this.addListener();

        const channel = new MessageChannel();

        this.worker.postMessage({port: channel.port1}, [channel.port1]);

        channel.port2.on("message", (data: any) => {
            console.log('port message: ' + data);
        });

        super.init(wait);
    }


    private addListener() {
        this.worker.on("error", (er: Error) => {
            console.log(er);
        });
        this.worker.on("exit", (ex: number) => {
            console.log("exit " + ex);
        });
        this.worker.on("online", () => {
            console.log("online");
            this.worker.postMessage({});
        });
        this.worker.on("message", (val: any) => {
            console.log("worker mess: "+ val);
        });


    }

}

