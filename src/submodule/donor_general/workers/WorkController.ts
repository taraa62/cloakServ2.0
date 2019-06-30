import {ItemDomain} from "../ItemDomain";
import {BLogger} from "../../../module/logger/BLogger";
import {Request, Response} from "express";

export class WorkController {

    constructor(private parent: ItemDomain, private logger: BLogger) {
        this.init();
    }

    private init(): void {

    }

    public async run(req: Request, res: Response, next: Function): Promise<any> {

    }

}
