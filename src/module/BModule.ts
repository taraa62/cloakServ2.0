import {IModuleConfig} from "../server/IConfig";
import {IServer} from "../server/IServer";
import {IResult} from "../utils/IUtils";
import {BLogger} from "./logger/BLogger";
import {EModules} from "../server/config";
import FileManager from "../utils/FileManager";


export class BModule {

    protected fileManager: FileManager = FileManager;
    protected app: IServer;
    protected config: IModuleConfig;
    protected name: string;
    protected subConfig: any;
    protected isDestroy: boolean;
    protected logger: BLogger;


    constructor(config: IModuleConfig, app: IServer) {
        this.app = app;
        this.config = config;
        this.subConfig = config.config || {};
        this.name = config.name;
        this.isDestroy = false;


        this.logger = (app)?app.getLoggerModule().getLogger():new BLogger();
    }

    // for simple initialization after call constructor
    public async init(): Promise<IResult> {
        return IResult.success;
    }

    public async endInit(): Promise<IResult> {
        return IResult.success;
    }


    public getModule(eModule: EModules): BModule {
        return this.app.getModule(eModule);
    }


    public getLogger(): BLogger {
        return this.logger;
    }


    public async destroy(): Promise<IResult> {
        console.log("destroy=>", this.name || this.constructor.name);
        this.isDestroy = true;
        return IResult.success;
    }

}
