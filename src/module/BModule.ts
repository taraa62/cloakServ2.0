import {IModuleConfig} from "../server/IConfig";
import {IServer} from "../server/IServer";
import {FileManager} from "../utils/FileManager";

export class BModule {

    private _wait: Function;
    protected fileManager: FileManager = FileManager;
    protected app: IServer;
    protected config: IModuleConfig;
    protected name: string;
    protected subConfig: any;
    protected isDestroy: boolean;
    protected listWait: Array<Promise<boolean>>;
    protected logger: any;


    constructor(config: IModuleConfig, app: IServer, wait: Function) {
        if (wait) this._wait = wait;
        this.app = app;
        this.config = config;
        this.subConfig = config.config || {};
        this.name = config.name;
        this.isDestroy = false;
        this.listWait = [];


        // if (this.app) this.logger = app.;

        this.init(this.getWaitInit());
        Promise.all(this.listWait).then((v) => {
            this.listWait.length = 0;
            this.initResolve();
            delete this.listWait;
        });
    }

    getWaitInit(): Function {
        let resp: Function = null;
        const waite = new Promise((res) => {
            resp = res;
        });
        this.listWait.push(waite as Promise<any>);
        return resp;
    }

    // for simple initialization after call constructor
    init(_wait: Function): void {
        _wait();
    }


    initResolve(): void {
        if (this._wait && this.listWait.length < 1) {
            this._wait(true);
            delete this._wait;
        }
    }

    endInit(): void {
    } // run after initialization all modules (before and after run app)

    destroy(): void {
        console.log("destroy=>", this.name || this.constructor.name);
        this.isDestroy = true;
    }

    getModule(name: string): BModule {
        return this.app.getModule(name);
    }

    getConfigModule(name: string): IModuleConfig {
        return this.app.getConfigModule(name);
    }

    public getLogger(): any {
        return this.logger;
    }


}
