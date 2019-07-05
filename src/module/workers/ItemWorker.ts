import {Random} from "../../utils/Random";
import {MessageChannel, Worker} from "worker_threads";
import {FileManager} from "../../utils/FileManager";
import {IWorkerController, IWorkerData, WorkerOption} from "./WorkerOption";
import {IResult} from "../../utils/IUtils";
import {WorkerMessage} from "./WorkerMessage";

//TODO close channels port!!!!;
export class ItemWorker {

    public readonly key = Random.randomString();

    public isOnline: boolean = false;
    public isDead: boolean = false;

    protected parent: IWorkerController;
    protected worker: Worker;
    protected _path: string;
    protected readonly id: string = Random.randomString();
    protected listenersWorker: Map<string | symbol, Set<Function>> = new Map<string, Set<Function>>();
    protected listenersChannel: Map<string | symbol, Set<Function>> = new Map<string, Set<Function>>();


    constructor(_path: string, data: any, protected option: WorkerOption) {
        this._path = FileManager.getSimplePath(_path, __dirname);
        this.init(data);
    }


    protected init(data: any): void {


        const workData: IWorkerData = {
            //    port: channel ? channel.port1 : null,
            data: data
        };
        this.worker = new Worker(this._path, {workerData: workData});
        this.listenerListenerWorker();


        /*    let channel: MessageChannel = null;
            if (this.option.isMessageChannel) {
                channel = new MessageChannel();

                this.listenerChannel(channel);
            }

            const transfer: any[] = [];
            if (channel) transfer.push(channel.port1);




            this.workers.postMessage(data, transfer);

    */
    }

    public setParent(p: IWorkerController): void {
        this.parent = p;
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
        const dispath = (list: Set<Function>, data: any = null) => {
            if (list) Array.from(list).map(v => v(data));
        };

        this.worker.on("error", (er: Error) => {
            this.isOnline = false;
            if (this.isDead) return;
            dispath(this.listenersWorker.get("error"), er);
            this.callParentDeadWorker(er);
        });
        this.worker.on("exit", (ex: number) => {
            this.isOnline = false;
            if (this.isDead) return;
            dispath(this.listenersWorker.get("exit"), ex);
            this.callParentDeadWorker(`worker exit with code => ${ex}, path=> ${this._path}`);
        });
        this.worker.on("online", () => {
            if (this.isDead) return;
            this.isOnline = true;
            dispath(this.listenersWorker.get("online"));

        });
        this.worker.on("message", (val: WorkerMessage) => {
            if (this.isDead) return;
            dispath(this.listenersWorker.get("message"), val);
        });
    }

    public addListenerWorker(event: string | symbol, callback: Function): void {
        if (this.isDead) return;
        if (!this.listenersWorker.has(event)) {
            this.listenersWorker.set(event, new Set<Function>().add(callback));
        } else {
            const _set: Set<Function> = this.listenersWorker.get(event);
            if (!_set.has(callback)) _set.add(callback);
        }
    }

    public addListenerChannel(event: string | symbol, callback: Function): void {
        if (this.isDead) return;
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

    protected callParentDeadWorker(er: number | string | Error): void {
        if (this.parent) {
            this.isDead = true;
            this.parent.workerDead(this.key, er);
        }
    }


    public async destroy(): Promise<IResult> {
        this.isDead = true;
        this.worker = null;
        this.option = null;

        this.listenersWorker.clear();
        this.listenersWorker = null;

        this.listenersChannel.clear();
        this.listenersChannel = null;
        let IRes: IResult = IResult.success;
        if (this.worker) {
            this.worker.removeAllListeners();

            await this.worker.terminate((err, code) => {
                if (err) IRes = {error: err, code: code};
                else IRes = {success: true, code: code};
            });
        }
        return IRes;
    }
}
