import {FileManager} from "./FileManager";
import {IConfigNginx, IResult, ItemConfig} from "./IUtils";
import {CDMCommand, CMDResult} from "./cmd/CMDResult";
import {CMDUtils} from "./cmd/CMDUtils";
import {BLogger} from "../module/logger/BLogger";

export class NginxUtils {

    private static logger: BLogger | any = console;

    private static configs: Map<string, IConfigNginx> = new Map<string, IConfigNginx>();

    public static setLogger(logger: BLogger) {
        NginxUtils.logger = logger;
    }


    public static checkNginxPid(): void {
        const _check = (path: string, search: string) => {
            let text = "";
            let isRewrite = false;
            let isErr = false;
            FileManager.readLineText(path, (err: Error, line: string, close: any) => {
                if (err) {
                    isErr = true;
                    return;
                } else if (line) {
                    if (line.indexOf(search) > -1 && !line.startsWith("#")) {
                        line = "#" + line;
                        isRewrite = true;
                    }
                    text += line + "\n";
                } else if (close) {
                    if (!isErr && isRewrite) {
                        FileManager.rewriteFile(path, text);
                    }
                } else {
                    text += "\n";
                    // this.logger.error(`error=> ${err} line => ${line}  close => ${close}`)
                }
            });

        };
    }

    /*
    check status activ nginx, if status !==0, start nginx.
     */
    public static async checkRun(): Promise<IResult> {
        let status: IResult = await this.statusNginx();
        if (status.code !== 0) {
            status = await this.startNginx();
        }
        return status;
    }

    /**
     * error code: if 0- nginx activ, 3 - stop
     */
    public static async statusNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.STATUS_NGINX);
        const ires: IResult = this.getResult(result);
        return ires;
    }


    public static async stopNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.STOP_NGINX);
        return this.getResult(result);
    }

    public static async startNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.START_NGINX);
        return this.getResult(result);
    }

    public static getResult(result: CMDResult): IResult {
        const res: IResult = {
            code: result.exitCode,
            error: result.error,
            success: result.error ? false : true,
            data: result.data,
        };
        return res;
    }


    public static async createNginxConfig(conf: ItemConfig, pathToResource: string): Promise<IResult> {
        NginxUtils.logger.info(`create config for: ${conf.domain} in folder: ${pathToResource}`);

        if (!conf || !pathToResource) return <IResult>{error: "one or more params is null"};
        const config: string = await this.getConfig(conf.nameConfig);

        console.log('sdwqd')
    }


    public static async getConfig(nameConfig: string): Promise<string> {
        if (this.configs && this.configs.size == 0) {
            let path = FileManager.backFolder(__dirname, 2);
            path += "/libs/nginx/";
            const res: IResult = await FileManager.getFileInFolder(path);
            if (res.success && res.data instanceof Array) {
                for (let v of res.data) {
                    const conf = await FileManager.readFile(v.path);
                    if (conf.success) {
                        const ss = conf.data.indexOf("##", 2);
                        if (ss > 5) {
                            const name = conf.data.substr(2, ss - 2).split("=")[1];
                            if (name) {
                                const item: IConfigNginx = {
                                    name: name,
                                    config: conf.data
                                };
                                this.configs.set(name, item);
                            }
                        }
                    }
                }
            }
            if (this.configs.has(nameConfig)) return this.configs.get(nameConfig).config;
        }

        return null;
    }
}
