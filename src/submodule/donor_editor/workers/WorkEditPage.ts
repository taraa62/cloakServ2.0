import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";
import {FileManager} from "../../../utils/FileManager";
import {IResult} from "../../../utils/IUtils";
import {IMessageWorkerEditTextReq, IMessageWorkerEditTextResp} from "../../interface/IMessageWorkers";
import {IItemConfig, IRegular, IRegulations} from "../../interface/configs/IConfig";
import {EditText} from "./EditText";
import {EProcessEdit} from "../../interface/EGlobal";

export class WorkEditPage extends BasePoolWorker {

    private configs: IItemConfig[];
    private editText: EditText;

    protected init() {
        this.configs = this.workerData.configs;
        this.editText = new EditText();
        super.init();
    }


    protected resetWorker(data: any): void {

    }

    private async editFile(item: IMessageWorkerEditTextReq): Promise<any> {
        let text: string = <string>await ((item.text) ? item.text : (item.pathToFile) ? this.getTextFromDisk(item.pathToFile) : "");

        const regulations: IRegulations[] = this.getRegulation(item.host);
        if (!regulations) super.sendTaskComplitSuccess(text);

        const list: IRegulations[] = this.isEditText(item, regulations);
        if (!list) return super.sendTaskComplitSuccess(text);
        else {
            const iRes: IResult = <IResult>await this.editText.edit(list, item, text);
            const resp: IMessageWorkerEditTextResp = {}
            if (iRes.error) resp.error = iRes.error;
            if (iRes.data) resp.text = iRes.data || text;

            (iRes.error) ? super.sendTaskComplitError(resp) : super.sendTaskComplitSuccess(resp);
        }
    }

    private getRegulation(host: string): IRegulations[] {
        for (let v of this.configs) {
            if (v.data.ourHost === host) return v.data.regulations;
        }
        return null;
    }


    private async getTextFromDisk(pathToFile: string): Promise<string> {
        const iRes: IResult = <IResult>await FileManager.readFile(pathToFile).catch(er => {
            this.logger.error(er);
            return IResult.error;
        });
        return iRes.error ? "" : iRes.data;
    }

    private isEditText(item: IMessageWorkerEditTextReq, regulations: IRegulations[]): IRegulations[] {
        if (!regulations || regulations.length < 1) return null;

        const listReg: IRegulations[] = [];
        for (let a = 0; a < regulations.length; a++) {
            const r: IRegulations = regulations[a];
            if (r.pages) {
                if (r.pages.indexOf("*") > -1) listReg.push(r);
                else
                    for (let c = 0; c < r.pages.length; c++) {
                        if (item.url.indexOf(r.pages[c]) > -1) listReg.push(r);
                    }
            }
        }
        return listReg;
    }

    private regsListToRegList(list: IRegulations[], process: EProcessEdit): IRegular[] {
        const sList = [...list];

        return []
    }


}

new WorkEditPage();
