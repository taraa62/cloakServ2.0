import {DonorModule} from "./DonorModule";

export class BaseDonorController {

    constructor(protected parent: DonorModule) {
        this.init();
    }

    protected init(){

    }



}
