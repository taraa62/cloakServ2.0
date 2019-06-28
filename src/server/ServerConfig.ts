import {ENV} from "../const/System";
import {FileManager} from "../utils/FileManager";
import {IConfig, ILoggerConfig, IModuleConfig, IServerConfig} from "./IConfig";
import {BaseServer} from "./BaseServer";
import {IResult} from "../utils/IUtils";

export class ServerConfig {

    public NODE_ENV: string = "test";

    public dirProject: string = FileManager.backFolder(__dirname, 2);
    public version: string = "";


    public config: IConfig = null;
    public app: BaseServer = null;


    public constructor(config: IConfig) {
        this.config = config;
        this.updVersionServer();
    }

    public async updVersionServer(): Promise<any> {
        const json: IResult = await FileManager.readFile(this.dirProject + "/package.json").catch((er) => '{"version":"undefined"}') as IResult;
        this.version = JSON.parse(json.data).version;
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
