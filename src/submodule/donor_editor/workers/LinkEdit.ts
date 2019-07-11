import {WorkEditPage} from "./WorkEditPage";
import {BLogger} from "../../../module/logger/BLogger";
import {IMessageWorkerEditTextReq} from "../../interface/IMessageWorkers";

export class LinkEdit {

    constructor(private parent: WorkEditPage, private logger: BLogger) {

    }

    public endEditCheckLinks(): void {

    }

    public checkLink(item: IMessageWorkerEditTextReq, link: string): string {


        return "";
    }

}
