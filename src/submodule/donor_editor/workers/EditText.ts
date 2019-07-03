import {IMessageWorkerEditTextReq} from "./EEditText";
import {IRegulations, IWhere} from "../../donor_configs/IConfig";
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


