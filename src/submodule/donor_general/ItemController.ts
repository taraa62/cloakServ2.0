import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {IBaseConfig} from "../interface/configs/IBaseConfig";
import {FileManager} from "../../utils/FileManager";
import {CONTROLLERS} from "../DonorModule";
import {DonorConfigsController} from "../donor_configs/DonorConfigsController";
import {IItemConfig} from "../interface/configs/IConfig";
import {ItemDomain} from "./ItemDomain";
import {ClassUtils} from "../../utils/ClassUtils";
import {BLogger} from "../../module/logger/BLogger";
import {IItemNginxConfig, INginxConfig} from "../interface/configs/INginxConfig";
import {BWorker} from "./workers/BWorker";


export interface IItemController extends IBaseDonorConfig {
    baseConfig: string;
    nginxConfig: string;
}

export class ItemController extends BaseDonorController {

    private sConf: IItemController;
    private mapDomains: Map<string, ItemDomain>;

    private baseConfig: IBaseConfig;
    private nginxConfig: INginxConfig;

    public async init(): Promise<IResult> {
        this.sConf = <IItemController>this.config;
        this.mapDomains = new Map<string, ItemDomain>();

        this.baseConfig = await this.loadConfig(this.sConf.baseConfig);
        if (!this.baseConfig) return IResult.error("base config isn't load");

        this.nginxConfig = await this.loadConfig(this.sConf.nginxConfig);
        if (!this.nginxConfig) return IResult.error("nginx config isn't load");

        return IResult.success;
    }

    public async endInit(): Promise<IResult> {
        this.initConfigs().catch(error => this.logger.error(error));

        return IResult.success;
    }


    private async loadConfig(cPath: string): Promise<any> {
        const path: string = FileManager.getSimplePath(cPath, FileManager.backFolder(__dirname, 3));
        const ires: IResult = await FileManager.readFile(path).catch(e => {
            this.logger.error(e);
            return e;
        });
        if (ires.success) return JSON.parse(ires.data);
        return null;
    }

    private async initConfigs(): Promise<void> {
        const list: IItemConfig[] = await (<DonorConfigsController>this.parent.getController(CONTROLLERS.CONFIGS)).getUseConfigs().catch(er => null);

        if (list && list.length > 0) {
            list.map(v => {
                this.mapDomains.set(v.data.ourHost, new ItemDomain(this, v));
            });
        }
        ClassUtils.initClasses(this.mapDomains).catch(er => this.logger.error(er));
    }

    public getNginxConfForHost(host: string): IItemNginxConfig {
        let conf = this.nginxConfig.item.find(v => v.host === host);
        if (!conf) conf = this.nginxConfig.defForNewConfigs;
        conf.configDomain = this.nginxConfig.configuration[host] || this.nginxConfig.configuration["http"];
        return conf;
    }

    public registerHostInController(host: string, controller: BWorker): void {
        this.parent.registerHostInController(host, controller);
    }

    public getLogger(): BLogger {
        return this.logger;
    }

    public getBaseConfig(): IBaseConfig {
        return this.baseConfig;
    }


}
