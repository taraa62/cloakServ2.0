import {ItemController} from "./ItemController";
import {IItemConfig} from "../donor_configs/IData";
import {BLogger} from "../../module/logger/BLogger";
import {IResult} from "../../utils/IUtils";
import {WorkerController} from "./workers/WorkerController";
import {BaseDonorController} from "../BaseDonorController";
import {CONTROLLERS} from "../DonorModule";
import {IItemDomainInfo} from "./item/IClient";
import {IItemNginxConfig} from "../donor_configs/INginxConfig";
import {IBaseConfig} from "../donor_configs/IBaseConfig";
import {WorkerHeaders} from "./workers/WorkerHeaders";
import {WorkerActions} from "./workers/WorkerActions";
import {BWorker} from "./workers/BWorker";
import {EItemDomainController} from "./workers/IWorkerGeneral";

export class ItemDomain {

    protected logger: BLogger;
    private donorURl: IItemDomainInfo;
    private ourURL: IItemDomainInfo;
    private ngixConf: IItemNginxConfig;

    private workersMap: Map<EItemDomainController, BWorker>;

    constructor(private controller: ItemController, private conf: IItemConfig) {
        this.logger = controller.getLogger();
    }

    public async init(): Promise<IResult> {
        try {
            this.ngixConf = this.controller.getNginxConfForHost(this.conf.data.ourHost);
            this.donorURl = this.updUrl(this.conf.data.donorOrigin);
            this.ourURL = this.updUrl(this.ngixConf.configDomain.protocol + "://" + this.conf.data.ourHost);

            this.workersMap = new Map<EItemDomainController, BWorker>()
            this.workersMap.set(EItemDomainController.CONTROLLER, new WorkerController(this, this.logger));
            this.workersMap.set(EItemDomainController.HEADER, new WorkerHeaders(this, this.logger));
            this.workersMap.set(EItemDomainController.ACTION, new WorkerActions(this, this.logger));


            this.controller.registerHostInController(this.conf.data.ourHost, this.workersMap.get(EItemDomainController.CONTROLLER));

            return IResult.success;

        } catch (e) {
            return IResult.error(e);
        }

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
    public getWorker(worker:EItemDomainController): BWorker {
        return this.workersMap.get(worker);
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
            protocol: (url.protocol.startsWith("https")) ? "https" : "http",
            protocolFull: url.protocol + "//",
            domain: domain
        };
    }



}
