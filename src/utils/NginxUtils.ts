import {FileManager} from "./FileManager";
import {CDMCommand, CMDResult} from "./cmd/CMDResult";
import {CMDUtils} from "./cmd/CMDUtils";
import {BLogger} from "../module/logger/BLogger";
import {StringUtils} from "./StringUtils";
import {IConfigNginx, IItemConfigNginx} from "../submodule/interface/configs/INginxConfig";
import {IResult} from "./IUtils";

export class NginxUtils {

    private static logger: BLogger | any = console;
    private static isBlockGenerateConfigs: boolean = false;

    private static configs: Map<string, IConfigNginx> = new Map<string, IConfigNginx>();

    public static setLogger(logger: BLogger) {
        NginxUtils.logger = logger;
    }

    public static blockGenerateConfigs(isBlock: boolean) {
        this.isBlockGenerateConfigs = isBlock;
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

    public static async createLinkOnConfig(domain: string): Promise<IResult> {
        const command = `ln -s /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/`
        const result: CMDResult = await CMDUtils.runCommandFullResult(command);
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


    public static async createNginxConfig(conf: IItemConfigNginx): Promise<IResult> {
        if (this.isBlockGenerateConfigs) return NginxUtils.logger.info(`Block create all configs`);
        NginxUtils.logger.info(`create config for: ${conf.domain} in folder: ${conf.pathToResource}`);

        if (!conf) return {error: "one or more params is null"} as IResult;
        let config: string = await this.getConfigsWithFile(conf.nameConfig);
        if (config) {
            config = this.replaceConfig(config, conf);

            const iRes: IResult = await this.generateConfig(config, conf);
            return iRes;
        } else {
            return {error: "config not found!"};
        }
    }


    public static async getConfigsWithFile(nameConfig: string): Promise<string> {
        if (this.configs && this.configs.size < 1) {
            let path = FileManager.backFolder(__dirname, 2);
            path += "/libs/nginx/";
            const res: IResult = await FileManager.getFileInFolder(path);
            if (res.success && res.data instanceof Array) {
                for (const v of res.data) {
                    const conf = await FileManager.readFile(v.path);
                    if (conf.success) {
                        const ss = conf.data.indexOf("##", 2);
                        if (ss > 5) {
                            const name: string = conf.data.substr(2, ss - 2).split("=")[1];
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

    private static async generateConfig(config: string, conf: IItemConfigNginx): Promise<IResult> {
        const pathToConf: string = "/etc/nginx/sites-available/" + conf.domain;
        const isConfExist: boolean = await FileManager.isExist(pathToConf);
        if (isConfExist && !conf.isRewrite) return {error: "config is exist and isn't rewrite"};
        else {
            if (!isConfExist) {
                const iRes = await FileManager.writeToNewFile(pathToConf, config);
                if (iRes.error) return iRes;
                else return await this.createLinkOnConfig(conf.domain);
            } else {
                return await FileManager.rewriteFile(pathToConf, config);
            }
        }
    }

    public static replaceConfig(config: string, conf: IItemConfigNginx): string {
        config = StringUtils.replaceAll(config, "{DOMAIN_NAME}", conf.domain);
        config = StringUtils.replaceAll(config, "{SITE_ROOT_PATH}", conf.pathToResource);
        config = StringUtils.replaceAll(config, "{DOMAIN_PROTOCOL}", conf.protocolServer);
        config = StringUtils.replaceAll(config, "{NAME_SERVER}", conf.nameServerConfD);

        if (conf.sslSertificate) config = StringUtils.replaceAll(config, "{SSL_CERTIFICATE}", conf.sslSertificate);
        if (conf.sslSertificateKey) config = StringUtils.replaceAll(config, "{SSL_CERTIFICATE_KEY}", conf.sslSertificateKey);

        return config
    }
}
