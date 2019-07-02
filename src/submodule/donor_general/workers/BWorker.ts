import {ItemDomain} from "../ItemDomain";
import {BLogger} from "../../../module/logger/BLogger";

export class BWorker {

    constructor(protected parent: ItemDomain, protected logger: BLogger) {
        this.init();
    }

    public init(): void {
    }
}
