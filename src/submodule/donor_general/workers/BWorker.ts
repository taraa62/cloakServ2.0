import {ItemDomain} from "../ItemDomain";
import {BLogger} from "../../../module/logger/BLogger";

export class BWorker {

    constructor(public parent: ItemDomain, protected logger: BLogger) {
        this.init();
    }

    public init(): void {
    }
}
