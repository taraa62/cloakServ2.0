import express, {Request, Response, Router} from "express";
import {Signals} from "../const/Signals";
import {BModule} from "../module/BModule";
import {BLogger} from "../module/logger/BLogger";
import {LoggerModule} from "../module/logger/LoggerModule";
import {FileManager} from "../utils/FileManager";
import {ILoggerConfig, IModuleConfig} from "./IConfig";
import {IServer} from "./IServer";
import {ServerConfig} from "./ServerConfig";


export abstract class BaseServer implements IServer {

    protected conf: ServerConfig;
    protected logModule: LoggerModule;
    protected logger: BLogger;
    protected appExp: express.Application;
    protected modules: Map<string, BModule>;


    constructor() {
        console.log("---------START RUN INITIALIZATION SERVER-----------");
        this.conf = (process as any).constant.conf;
        this.conf.dirProject = FileManager.backFolder(__dirname, 2);
        this.conf.app = this;
        this.init();
    }

    private async init(): Promise<any> {
        await this.appendLogger();
        await this.appendListeners();
        await this.appendDevModule();
        await this.appendProcessListeners();
        await this.start();
    }

    private async appendLogger<T>(): Promise<any> {
        const configLogger: ILoggerConfig = this.conf.config.logger;
        if (configLogger) {
            this.logModule = await FileManager.createNewClass(configLogger.path, this.conf.dirProject, configLogger, null, null);

            // const _l = require(FileManager.getSimplePath(configLogger.path, this.conf.dirProject));
            // const mod: any = Object.values(_l)[0];
            // this.logModule = new mod(configLogger, null, null);
        }
        // this.logger = this.logModule.getLogger();
        this.logger = (this.logModule) ? this.logModule.getLogger() : new BLogger(null, null);

        // this.logger.info(" logger => info")
        // this.logger.error(" logger => error")
        // this.logger.debug(" logger => debug")
    }


    private async appendListeners(): Promise<any> {
        this.appExp = express();
        this.modules = new Map<string, BModule>();


        const route: Router = express.Router();

        route.get("/test", (req: Request, res: Response, next: Function) => {
            res.send({message: "Hello client GET"});
        });
        this.appExp.use("/", route);
    }

    private appendDevModule(): void {
        if (this.conf.isDEV()) {
            const maxListenersExceededWarning = require("max-listeners-exceeded-warning");
            maxListenersExceededWarning();
        }
    }


    private appendProcessListeners(): void {
        process.on("exit", async (code: number) => {
            this.logger.error(`About to exit with code: ${code}`);
            // if (!process.server.isDestroy)
            //     await process.server.destroy();
        });
        process.on("disconnect", async () => {
            this.logger.error(`disconnec:`);
            // if (!process.server.isDestroy)
            //     await process.server.destroy();
        });
        process.on("uncaughtException", async (code) => {
            this.logger.error(`uncaughtException: ${code}`);
            process.exit(0);
        });
        process.on("SIGINT", async () => {
            this.logger.error(`SIGINT `);
            // if (!process.server.isDestroy)
            //     await process.server.destroy();
        });
        (process as any).on(Signals.moduleError, async (mess: string) => {
            this.logger.error(mess);
            // if (!process.server.isDestroy)
            //     await process.server.destroy();
        });
        (process as any).on(Signals.coreError, async (mess: string) => {
            this.logger.error(mess);
            // if (!process.server.isDestroy)
            //     await process.server.destroy();
        });
    }

    protected async initModules(list: IModuleConfig[]): Promise<any> {
        const _listPromiseInit: Array<Promise<any>> = [];
        if (list && list.length > 0) {
            list.map(async (v: IModuleConfig) => {
                if (v.isUse) {
                    if (!this.modules.has(v.name)) {
                        const modul = new Promise(async (res, rej) => {
                            const m: BModule = await FileManager.createNewClass(v.path, this.conf.dirProject, v, this, res);
                            if (m) this.modules.set(v.name, m);
                            else res(true);
                        });
                        _listPromiseInit.push(modul);
                    } else {
                        this.logger.info(`module ${v.name}  path ${v.path} not initialization`);
                    }
                }
            });
        }
        await Promise.all(_listPromiseInit).then((v) => {
            console.log('anit end!')
        }).catch((er) => {
            this.logger.error(er);
            this.logger.error("----- ERROR inti modules before up server");
        });
    }

    protected endInitModules(): void {
        this.modules.forEach(v => {
            v.endInit();
        })
    }


    protected abstract start(): void;

    // ****** GET**///
    public getLoggerModule(): LoggerModule {
        return this.logModule;
    }

    public getModule(name: string): BModule {
        return this.modules.get(name);
    }

    public getConfigModule(name: string): IModuleConfig {
        return null;
    }
}
