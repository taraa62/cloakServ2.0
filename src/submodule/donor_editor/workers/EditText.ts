import {IMessageWorkerEditTextReq} from "../../interface/IMessageWorkers";
import {IRegulations, IWhere} from "../../interface/configs/IConfig";
import {IResult} from "../../../utils/IUtils";

export class EditText {


    public async edit(reqList: IRegulations[], item: IMessageWorkerEditTextReq, text: string): Promise<IResult> {


        return IResult.succData(text);
    }


    private getTypeSearch(where: IWhere) {
        if (where.startsWith) return "startsWith";
        if (where.endsWith) return "endsWith";
        if (where.indexOf) return "indexOf";
        if (where.exactly) return "exactly";
        return null;
    }

}


