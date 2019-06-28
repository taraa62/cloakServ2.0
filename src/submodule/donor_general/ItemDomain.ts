import {ItemController} from "./ItemController";
import {IItemConfig} from "../donor_configs/IData";
import {BLogger} from "../../module/logger/BLogger";
import {IResult} from "../../utils/IUtils";

export class ItemDomain {

    protected logger: BLogger;


    constructor(private controller: ItemController, private conf: IItemConfig) {
        this.logger = controller.getLogger();
    }

    public async init(): Promise<IResult> {
        return null;
    }
}
