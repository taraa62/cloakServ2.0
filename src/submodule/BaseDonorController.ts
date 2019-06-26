import {DonorModule} from "./DonorModule";

export interface IBaseDonorConfig {

}

export class BaseDonorController {

    protected logger: any;

    constructor(protected parent: DonorModule, protected config: IBaseDonorConfig) {
        this.logger = parent.getLogger();
        this.init();
    }

    protected init() {

    }


}
