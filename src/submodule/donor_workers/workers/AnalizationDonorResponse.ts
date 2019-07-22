import {WorkWithDonor} from "./WorkWithDonor";
import {IncomingMessage} from "http";
import {BLogger} from "../../../module/logger/BLogger";
import {IResult} from "../../../utils/IUtils";
import {TMessageWorkerDonorReq, TMessageWorkerDonorResp} from "../../interface/TMessageWorkers";
import {IWorkerMessage} from "../../../module/workers/WorkerMessage";


/*
    Подумати потім про
    -коли файл великий можливо робити перевірку на розмір загружаючого файлу, або ж загружати файл навіть якщо і закінчився час на відповідь
    - коли конфіг говорить що нам не потрібно зберігати цей файл на диск і не потрібно перевіряти його на редагування можна попробувати зробити
    передачу файла стрімом в респонс


 */

export class AnalizationDonorResponse {


    constructor(private controller: WorkWithDonor, private logger: BLogger) {
    }

    public analize(response: IncomingMessage, data: IWorkerMessage): void {
        if (response.statusCode < 200) this.respCode100(response, data).catch(er => this.controller.sendTaskComplitError(er, data.key));
        else if (response.statusCode >= 200 && response.statusCode < 300) this.respCode200(response, data).catch(er => this.controller.sendTaskComplitError(er, data.key));
        else if (response.statusCode >= 300 && response.statusCode < 400) this.respCode300(response, data).catch(er => this.controller.sendTaskComplitError(er, data.key));
        else if (response.statusCode >= 400 && response.statusCode < 500) this.respCode400(response, data).catch(er => this.controller.sendTaskComplitError(er, data.key));
        else this.respCode500(response, data).catch(er => this.controller.sendTaskComplitError(er, data.key));
    }


    private async respCode100(response: IncomingMessage, data: IWorkerMessage): Promise<any> {
        this.controller.sendTaskComplitError("RESPONSE CODE 100", data.key);
        return IResult.error("swdq");
    }

    private async respCode200(response: IncomingMessage, data: IWorkerMessage): Promise<any> {
        const iRes: IResult = await this.controller.workerFiles.saveFileOnDisk(response, <TMessageWorkerDonorReq>data.data).catch(e => IResult.error(e));

        if (iRes.error) return this.controller.sendTaskComplitError(iRes.error, data.key);
        const mess: TMessageWorkerDonorResp = {
                pathToFile: iRes.data,
                respHeaders:response.headers
            }
        ;
        return this.controller.sendTaskComplitSuccess(mess, data.key);
    }

    private async respCode300(response: IncomingMessage, data: IWorkerMessage): Promise<any> {
        return IResult.error("swdq");
    }

    private async respCode400(response: IncomingMessage, data: IWorkerMessage): Promise<any> {
        return IResult.error("swdq");
    }

    private async respCode500(response: IncomingMessage, data: IWorkerMessage): Promise<any> {
        return IResult.error("swdq");
    }

}
