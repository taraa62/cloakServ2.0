import {DonorModule} from "./DonorModule";
import {IResult} from "../utils/IUtils";
import {BLogger} from "../module/logger/BLogger";

export interface IBaseDonorConfig {

}

export class BaseDonorController {

    protected logger: BLogger;

    constructor(protected parent: DonorModule, protected config: IBaseDonorConfig) {
        this.logger = parent.getLogger();
    }

    public async init(): Promise<IResult> {
        return IResult.success;
    }


}
