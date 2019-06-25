import {Random} from "../../utils/Random";
import {MessageChannel, Worker} from "worker_threads";
import {FileManager} from "../../utils/FileManager";
import {IWorkerData, WorkerOption} from "./WorkerOption";
import {IResult} from "../../utils/IUtils";

//TODO close channels port!!!!;
export class ItemWorker {

    private worker: Worker;
    private _path: string;
    private readonly id: string = Random.randomString();
    private listenersWorker: Map<string | symbol, Set<Function>> = new Map<string, Set<Function>>();
    private listenersChannel: Map<string | symbol, Set<Function>> = new Map<string, Set<Function>>();

    constructor(_path: string, private data: any, private option: WorkerOption) {
        this._path = FileManager.getSimplePath(_path, __dirname);
        this.init();
    }


    private init(): void {


        let channel: MessageChannel = null;
        if (this.option.isMessageChannel) {
            channel = new MessageChannel();

            this.listenerChannel(channel);
        }

        const data: IWorkerData = {
        //    port: channel ? channel.port1 : null,
            data: this.data
        };
        const transfer: any[] = [];
        if (channel) transfer.push(channel.port1);

        this.worker = new Worker(this._path, {workerData: data});
        this.listenerListenerWorker();


        // this.worker.postMessage(data, transfer);
        this.worker.emit("init3", data)

    }


    private listenerChannel(channel: MessageChannel): void {
        channel.port2.on("message", (data: any) => {
            console.log('port message: ' + data);
        });
        channel.port2.on("close", (data: any) => {
            console.log('port message: ' + data);
        });
    }


    private listenerListenerWorker(): void {
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
            console.log("worker mess: " + val);
        });
          }

    public addListenerWorker(event: string | symbol, callback: Function): void {
        if (!this.listenersWorker.has(event)) {
            this.listenersWorker.set(event, new Set<Function>().add(callback));
        } else {
            const _set: Set<Function> = this.listenersWorker.get(event);
            if (!_set.has(callback)) _set.add(callback);
        }
    }

    public addListenerChannel(event: string | symbol, callback: Function): void {
        if (!this.listenersChannel.has(event)) {
            this.listenersChannel.set(event, new Set<Function>().add(callback));
        } else {
            const _set: Set<Function> = this.listenersChannel.get(event);
            if (!_set.has(callback)) _set.add(callback);
        }
    }


    public getId(): string {
        return this.id;
    }


    public async destroy(): Promise<IResult> {
        this.data = null;
        this.worker = null;
        this.option = null;

        this.listenersWorker.clear();
        this.listenersWorker = null;

        this.listenersChannel.clear();
        this.listenersChannel = null;

        this.worker.removeAllListeners();
        let IRes: IResult = null;
        await this.worker.terminate((err, code) => {
            if (err) IRes = {error: err, code: code};
            else IRes = {success: true, code: code};
        });
        return IRes;
    }
}
