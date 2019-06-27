import {RouteController} from "../RouteController";
import {BLogger} from "../../logger/BLogger";
import {Request, Response} from "express";
import {BModule} from "../../BModule";
import {IResult} from "../../../utils/IUtils";

export class Controller {

    constructor(private rController: RouteController, protected logger: BLogger) {

    }

    public async init(): Promise<IResult> {
        return IResult.success;
    }

    public async endInit(): Promise<IResult> {
        return IResult.success;
    }

    public async run(action: string, req: Request, res: Response, next: Function): Promise<any> {
        const targ: Function = (this as any)[action];

        if (targ) {
            if (typeof targ !== "function") {
                this.logger.error("target action isn't function!!");
                return next();
            } else {
                //TODO action register controller


            }

        } else return next();

    }

    protected getModule(name: string): BModule {
        return this.rController.getModule(name);
    }


}
