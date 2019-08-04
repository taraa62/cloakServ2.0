import {ItemController} from "./ItemController";
import {IItemConfig} from "../interface/configs/IConfig";
import {BLogger} from "../../module/logger/BLogger";
import {IResult} from "../../utils/IUtils";
import {WorkerController} from "./workers/WorkerController";
import {BaseDonorController} from "../BaseDonorController";
import {CONTROLLERS} from "../DonorModule";
import {IItemDomainInfo} from "../interface/IClient";
import {IItemNginxConfig} from "../interface/configs/INginxConfig";
import {IBaseConfig} from "../interface/configs/IBaseConfig";
import {WorkerHeaders} from "./workers/WorkerHeaders";
import {WorkerActions} from "./workers/WorkerActions";
import {BWorker} from "./workers/BWorker";
import {EDomainType, EItemDomainController, EResourceFolder} from "../interface/EGlobal";
import {FileManager} from "../../utils/FileManager";
import {ClassUtils} from "../../utils/ClassUtils";
import {Cleaner} from "./Cleaner";

export class ItemDomain {

    protected logger: BLogger;
    private donorURl: IItemDomainInfo;
    private ourURL: IItemDomainInfo;
    private ngixConf: IItemNginxConfig;
    private type: EDomainType = EDomainType.super;

    private resourceFolderMap: Map<EResourceFolder, string>;

    private workersMap: Map<EItemDomainController, BWorker>;

    constructor(private controller: ItemController, private conf: IItemConfig) {
        this.logger = controller.getLogger();
    }

    public async init(): Promise<IResult> {
        try {
            this.resourceFolderMap = new Map<EResourceFolder, string>();

            this.ngixConf = this.controller.getNginxConfForHost(this.conf.data.ourHost);
            this.donorURl = this.updUrl(this.conf.data.donorOrigin);
            this.ourURL = this.updUrl(this.ngixConf.configDomain.protocol + "://" + this.conf.data.ourHost);

            this.workersMap = new Map<EItemDomainController, BWorker>();
            this.workersMap.set(EItemDomainController.CONTROLLER, new WorkerController(this, this.logger));
            this.workersMap.set(EItemDomainController.HEADER, new WorkerHeaders(this, this.logger));
            this.workersMap.set(EItemDomainController.ACTION, new WorkerActions(this, this.logger));

            ClassUtils.initClasses(this.workersMap).catch(e => {
                throw new Error(e);
            });

            this.controller.registerHostInController(this.conf.data.ourHost, this.workersMap.get(EItemDomainController.CONTROLLER));
            const iRes: IResult = await this.checkResourceFolders([EResourceFolder.html, EResourceFolder.sub]);
            return iRes;
        } catch (e) {
            return IResult.error(e.error || e);
        }
    }

    private updUrl(stUrl: string): IItemDomainInfo {
        const url = new URL(stUrl);

        let domain = url.host;
        const list = url.host.split(".");
        if (list.length >= 3) {
            domain = list[list.length - 2] + "." + list[list.length - 1];
        }
        return {
            host: url.host,
            origin: url.protocol + "//" + url.host,
            protocol: (url.protocol.startsWith("https")) ? "https:" : "http:",
            protocolFull: url.protocol + "//",
            domain: domain
        };
    }

    private async checkResourceFolders(list: EResourceFolder[]): Promise<IResult> {
        const def: string = FileManager.getSimplePath(this.conf.data.nameResourceFolder, FileManager.backFolder(__dirname, 3));
        this.resourceFolderMap.set(EResourceFolder.def, def);
        const iRes: IResult = await Cleaner.check(this).catch(er => IResult.error(er));
        if (iRes.error) this.logger.error(iRes);

        for (let a = 0; a < list.length; a++) {
            const subP = "./" + list[a];
            const path: string = FileManager.getSimplePath(subP, def);
            const iRes: IResult = await FileManager.checkPathToFolder(path, null, true).catch(e => IResult.error(e));
            if (iRes.error) return iRes;
            this.resourceFolderMap.set(list[a], iRes.data);
        }
        return IResult.success;
    }


    public getDonorController(name: CONTROLLERS): BaseDonorController {
        return this.controller.getDonorController(name);
    }

    public getDonorURL(): IItemDomainInfo {
        return this.donorURl;
    }

    public getOurURL(): IItemDomainInfo {
        return this.ourURL;
    }

    public getNginxConf(): IItemNginxConfig {
        return this.ngixConf;
    }

    public getBaseConf(): IBaseConfig {
        return this.controller.getBaseConfig();
    }

    //*** get controller */
    public getWorker(worker: EItemDomainController): BWorker {
        return this.workersMap.get(worker);
    }

    public getDomainConfig(): IItemConfig {
        return this.conf;
    }

    public getResourceFolderBy(type: EResourceFolder): string {
        return this.resourceFolderMap.get(type) || null;
    }

    public getMainHost(): string {
        if (this.type === EDomainType.super) return this.ourURL.host;
        //TODO create logic for subDomain
        return null;
    }

}
