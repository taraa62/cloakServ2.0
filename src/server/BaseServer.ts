import express from "express";
import {Signals} from "../const/Signals";
import {BModule} from "../module/BModule";
import {BLogger} from "../module/logger/BLogger";
import {LoggerModule} from "../module/logger/LoggerModule";
import {FileManager} from "../utils/FileManager";
import {ILoggerConfig, IModuleConfig} from "./IConfig";
import {IServer} from "./IServer";
import {ServerConfig} from "./ServerConfig";
import {IResult} from "../utils/IUtils";
import {ClassUtils} from "../utils/ClassUtils";


export abstract class BaseServer implements IServer {

    protected conf: ServerConfig;
    protected logModule: LoggerModule;
    protected logger: BLogger;
    protected appExp: express.Application;
    protected modules: Map<string, BModule>;
    protected server: any;
    protected isDestroy: boolean = false;
    protected isStopInit: boolean = false;


    constructor() {
        console.log("---------START RUN INITIALIZATION SERVER-----------");
        this.conf = (process as any).constant.conf;
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
            this.logModule = await ClassUtils.createNewClass(configLogger.path, this.conf.dirProject, configLogger, null, null);

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


        /* const route: Router = express.Router();

         route.get("/test", (req: Request, res: Response, next: Function) => {
             res.send({message: "Hello client GET"});
         });
         this.appExp.use("/", route);*/
    }

    private appendDevModule(): void {
        if (this.conf.isDEV()) {
            const maxListenersExceededWarning = require("max-listeners-exceeded-warning");
            maxListenersExceededWarning();
        }
    }

//TODO  -доробити зупинку сервера!!!!!!!!!!!
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

    protected async initModules(list: IModuleConfig[]): Promise<boolean> {
        let initModule: boolean = true;
        if (list && list.length > 0) {
            // list.map(async (v: IModuleConfig) => {

            for (const v of list) {


                if (v.isUse) {
                    if (!this.modules.has(v.name)) {

                        const m: BModule = await ClassUtils.createNewClass(v.path, this.conf.dirProject, v, this);
                        if (m) {
                            const iRes: IResult = await m.init();
                            if (iRes.success) this.modules.set(v.name, m);
                            else {
                                initModule = false;
                                this.logger.error(iRes.error);
                            }
                        } else {
                            this.logger.info(`module ${v.name}  path ${v.path} not initialization`);
                        }
                    } else {
                        this.logger.info(`duplicate module ${v.name}  path ${v.path}`);
                    }
                }
            }
        }

        if (!initModule) {
            this.logger.error("----- ERROR inti modules before up server");
        }
        return initModule;
    }

    protected async endInitModules(): Promise<void> {
        for (let v of this.modules.values()) {
            const res: IResult = await v.endInit();
            if (res.error) {
                this.logger.error(res);
                if (!this.isStopInit) {
                    this.isStopInit = true;
                    process.nextTick(() => {
                        (process as any).emit(Signals.moduleError, "error initialization 'module after'");
                    });
                }

            }
        }
    }


    private async start(): Promise<any> {
        let isInit: boolean = await this.initModules(this.conf.getInitModuleBefore()).then((v) => true).catch((er) => false);
        if (isInit) {
            this.logger.info("all modules initialization before up server");
            const iRes: IResult = await this.upServer().catch(er => er);
            if (iRes.success) {
                isInit = await this.initModules(this.conf.getInitModuleAfter()).then((v) => true).catch((er) => false);
                if (isInit) {
                    await this.endInitModules();
                    if(!this.isStopInit) console.log("----- all module initialization----------");
                    else console.log("----- error initialization module in endInit ----------");
                } else {
                    process.nextTick(() => {
                        (process as any).emit(Signals.moduleError, "error initialization 'module after'");
                    });
                }
            } else {
                this.logger.error(iRes.error);
                (process as any).emit(Signals.coreError, "error up server!!!!!!!");
            }
        } else {
            process.nextTick(() => {
                (process as any).emit(Signals.moduleError, "error initialization 'module before'");
            });
        }
    };


    protected abstract upServer(): Promise<IResult>;

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
