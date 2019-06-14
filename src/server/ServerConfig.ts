import {ENV} from "../const/System";
import {FileManager} from "../utils/FileManager";
import {IConfig, ILoggerConfig, IModuleConfig, IServerConfig} from "./IConfig";
import {BaseServer} from "./BaseServer";

export class ServerConfig {

    public NODE_ENV: string = (process.argv.indexOf("--dev") === -1) ? "production" : "test";

    public dirProject: string = "";
    public version: string = "";


    public config: IConfig = null;
    public app: BaseServer = null;


    public constructor(config: IConfig) {
        this.config = config;
        this.updVersionServer();
    }

    public async updVersionServer(): Promise<any> {
        const json: any = await FileManager.readFile(this.dirProject + "/package.json").catch((er) => '{"version":"undefined"}');
        this.version = JSON.parse(json).version;
    }

    public isDEV(): boolean {
        return this.NODE_ENV === ENV.dev;
    }

    public isProd(): boolean {
        return this.NODE_ENV === ENV.prod;
    }

    public getLoggerConfig(): ILoggerConfig {
        return this.config.logger;
    }

    public getServerConfig(): IServerConfig {
        return this.config.server;
    }

    public getInitModuleBefore(): IModuleConfig[] {
        return this.config.initModuleBeforeRunServe;
    }

    public getInitModuleAfter(): IModuleConfig[] {
        return this.config.initModuleAfterRunServe;
    }
}
