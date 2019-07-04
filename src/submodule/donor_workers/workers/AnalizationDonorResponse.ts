import {WorkWithDonor} from "./WorkWithDonor";
import {IncomingMessage} from "http";
import {BLogger} from "../../../module/logger/BLogger";
import {IResult} from "../../../utils/IUtils";
import {IMessageWorkerDonorReq, IMessageWorkerDonorResp} from "../../interface/IMessageWorkers";


/*
    Подумати потім про
    -коли файл великий можливо робити перевірку на розмір загружаючого файлу, або ж загружати файл навіть якщо і закінчився час на відповідь
    - коли конфіг говорить що нам не потрібно зберігати цей файл на диск і не потрібно перевіряти його на редагування можна попробувати зробити
    передачу файла стрімом в респонс


 */

export class AnalizationDonorResponse {


    constructor(private controller: WorkWithDonor, private logger: BLogger) {
    }

    public analize(response: IncomingMessage, data: IMessageWorkerDonorReq): void {
        if (response.statusCode < 200) this.respCode100(response, data).catch(er => this.controller.sendTaskComplitError(er));
        else if (response.statusCode >= 200 && response.statusCode < 300) this.respCode200(response, data).catch(er => this.controller.sendTaskComplitError(er));
        else if (response.statusCode >= 300 && response.statusCode < 400) this.respCode300(response, data).catch(er => this.controller.sendTaskComplitError(er));
        else if (response.statusCode >= 400 && response.statusCode < 500) this.respCode400(response, data).catch(er => this.controller.sendTaskComplitError(er));
        else this.respCode500(response, data).catch(er => this.controller.sendTaskComplitError(er));
    }


    private async respCode100(response: IncomingMessage, data: IMessageWorkerDonorReq): Promise<any> {
        this.controller.sendTaskComplitError("RESPONSE CODE 100");
        return IResult.error("swdq")
    }

    private async respCode200(response: IncomingMessage, data: IMessageWorkerDonorReq): Promise<any> {
        const iRes: IResult = await this.controller.workerFiles.saveFileOnDisk(response, data).catch(e => IResult.error(e));

        if (iRes.error) return this.controller.sendTaskComplitError(iRes.error);
        const mess: IMessageWorkerDonorResp = {
            pathToFile: iRes.data
        }
        return this.controller.sendTaskComplitSuccess(mess);
    }

    private async respCode300(response: IncomingMessage, data: IMessageWorkerDonorReq): Promise<any> {
        return IResult.error("swdq")
    }

    private async respCode400(response: IncomingMessage, data: IMessageWorkerDonorReq): Promise<any> {
        return IResult.error("swdq")
    }

    private async respCode500(response: IncomingMessage, data: IMessageWorkerDonorReq): Promise<any> {
        return IResult.error("swdq")
    }

}
