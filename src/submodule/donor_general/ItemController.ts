import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {IBaseConfig} from "../donor_configs/IBaseConfig";
import {FileManager} from "../../utils/FileManager";
import {CONTROLLERS} from "../DonorModule";
import {DonorConfigsController} from "../donor_configs/DonorConfigsController";
import {IItemConfig} from "../donor_configs/IData";
import {ItemDomain} from "./ItemDomain";
import {ClassUtils} from "../../utils/ClassUtils";
import {BLogger} from "../../module/logger/BLogger";
import {INginxConfig} from "../donor_configs/INginxConfig";


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
        try {
            this.sConf = <IItemController>this.config;
            this.mapDomains = new Map<string, ItemDomain>();

            this.baseConfig = await this.loadBaseConfig();
            if (!this.baseConfig) return IResult.error("base config isn't load");

            this.nginxConfig = await this.loadNginxConfig();
            if (!this.nginxConfig) return IResult.error("nginx config isn't load");

            this.initConfigs().catch(error => this.logger.error(error));

        } catch (e) {
            return IResult.error(e);
        }
        return IResult.success;
    }

    private async loadBaseConfig(): Promise<IBaseConfig> {
        const path: string = FileManager.getSimplePath(this.sConf.baseConfig, FileManager.backFolder(__dirname, 3));
        const ires: IResult = await FileManager.readFile(path).catch(e => {
            this.logger.error(e);
            return e;
        });
        if (ires.success) return ires.data;
        return null;
    }

    private async loadNginxConfig(): Promise<INginxConfig> {
        const path: string = FileManager.getSimplePath(this.sConf.nginxConfig, FileManager.backFolder(__dirname, 3));
        const ires: IResult = await FileManager.readFile(path).catch(e => {
            this.logger.error(e);
            return e;
        });
        if (ires.success) return ires.data;
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

    public registerHostInController(host: string, item: ItemDomain): void {
        this.parent.registerHostInController(host, item);
    }

    public getLogger(): BLogger {
        return this.logger;
    }

}
