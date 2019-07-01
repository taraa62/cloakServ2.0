import {ItemController} from "./ItemController";
import {IItemConfig} from "../donor_configs/IData";
import {BLogger} from "../../module/logger/BLogger";
import {IResult} from "../../utils/IUtils";
import {WorkController} from "./workers/WorkController";
import {BaseDonorController} from "../BaseDonorController";
import {CONTROLLERS} from "../DonorModule";
import {IItemDomainInfo} from "./workers/IClient";
import {IItemNginxConfig} from "../donor_configs/INginxConfig";
import {Request, Response} from "express";

export class ItemDomain {

    protected logger: BLogger;
    private donorURl: IItemDomainInfo;
    private ourURL: IItemDomainInfo;
    private ngixConf: IItemNginxConfig;

    private workController: WorkController;

    constructor(private controller: ItemController, private conf: IItemConfig) {
        this.logger = controller.getLogger();
    }

    public async init(): Promise<IResult> {
        try {
            this.ngixConf = this.controller.getNginxConfForHost(this.conf.data.ourHost);
            this.donorURl = this.updUrl(this.conf.data.donorOrigin);
            this.ourURL = this.updUrl(this.ngixConf.configDomain.protocol + "://" + this.conf.data.ourHost);

            this.workController = new WorkController(this, this.logger);


            this.controller.registerHostInController(this.conf.data.ourHost, this);

            return IResult.success;

        } catch (e) {
            return IResult.error(e);
        }

    }

    public getDonorController(name: CONTROLLERS): BaseDonorController {
        return this.controller.getDonorController(name);
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


    public async run(req: Request, res: Response, next: Function): Promise<any> {
        return this.workController.run(req, res, next);
    }
}
