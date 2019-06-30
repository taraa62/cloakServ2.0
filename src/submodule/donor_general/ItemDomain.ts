import {ItemController} from "./ItemController";
import {IItemConfig} from "../donor_configs/IData";
import {BLogger} from "../../module/logger/BLogger";
import {IResult} from "../../utils/IUtils";
import {Request, Response} from "express";
import {WorkController} from "./workers/WorkController";

export class ItemDomain {

    protected logger: BLogger;
    private donorURl: URL;
    private ourURL: URL;

    private workController: WorkController;

    constructor(private controller: ItemController, private conf: IItemConfig) {
        this.logger = controller.getLogger();
    }

    public async init(): Promise<IResult> {
        try {
            this.updUrl(this.donorURl, this.conf.data.donorOrigin);
            this.updUrl(this.ourURL, this.conf.data.ourHost);

            this.workController = new WorkController(this, this.logger);


            this.controller.registerHostInController(this.conf.data.ourHost, this);

            return IResult.success;

        } catch (e) {
            return IResult.error(e);
        }

    }

    private updUrl(url: URL, stUrl: string): void {

    }


    public async run(req: Request, res: Response, next: Function): Promise<any> {
        return this.workController.run(req, res, next);
    }
}
