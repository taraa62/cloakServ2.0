import {ItemController} from "./ItemController";
import {IItemConfig} from "../donor_configs/IData";
import {BLogger} from "../../module/logger/BLogger";
import {IResult} from "../../utils/IUtils";
import {Request, Response} from "express";
import {WorkController} from "./workers/WorkController";
import {BaseDonorController} from "../BaseDonorController";
import {CONTROLLERS} from "../DonorModule";
import {IItemDomainInfo} from "./workers/IClient";

export class ItemDomain {

    protected logger: BLogger;
    private donorURl: IItemDomainInfo;
    private ourURL: IItemDomainInfo;

    private workController: WorkController;

    constructor(private controller: ItemController, private conf: IItemConfig) {
        this.logger = controller.getLogger();
    }

    public async init(): Promise<IResult> {
        try {
            this.updUrl(this.conf.data.donorOrigin);
            this.updUrl(this.conf.data.ourHost);

            this.workController = new WorkController(this, this.logger);


            this.controller.registerHostInController(this.conf.data.ourHost, this);

            return IResult.success;

        } catch (e) {
            return IResult.error(e);
        }

    }

    public getDonorController(name:CONTROLLERS):BaseDonorController{
        return this.controller.getDonorController(name);
    }


    private updUrl(stUrl: string): void {

    }


    public async run(req: Request, res: Response, next: Function): Promise<any> {
        return this.workController.run(req, res, next);
    }
}
