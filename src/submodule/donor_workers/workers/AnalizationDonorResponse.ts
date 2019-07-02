import {WorkWithDonor} from "./WorkWithDonor";
import {IncomingMessage} from "http";
import {BLogger} from "../../../module/logger/BLogger";
import {IResult} from "../../../utils/IUtils";


/*
    Подумати потім про
    -коли файл великий можливо робити перевірку на розмір загружаючого файлу, або ж загружати файл навіть якщо і закінчився час на відповідь
    - коли конфіг говорить що нам не потрібно зберігати цей файл на диск і не потрібно перевіряти його на редагування можна попробувати зробити
    передачу файла стрімом в респонс


 */

export class AnalizationDonorResponse {


    constructor(private controller: WorkWithDonor, private logger: BLogger) {
    }

    public analize(response: IncomingMessage): void {
        if (response.statusCode < 200) this.respCode100(response);
        else if (response.statusCode >= 200 && response.statusCode < 300) this.respCode200(response);
        else if (response.statusCode >= 300 && response.statusCode < 400) this.respCode300(response);
        else if (response.statusCode >= 400 && response.statusCode < 500) this.respCode400(response);
        else this.respCode500(response);
    }


    private respCode100(response: IncomingMessage): void {
        this.controller.sendTaskComplitError("RESPONSE CODE 100");
    }

    private async respCode200(response: IncomingMessage): Promise<void> {
        const iRes: IResult = await this.controller.workerFiles.saveFileOnDisk(response);

        if (iRes.error) return this.controller.sendTaskComplitError(iRes.error);
        return this.controller.sendTaskComplitSuccess(iRes.success)
    }

    private respCode300(response: IncomingMessage): void {

    }

    private respCode400(response: IncomingMessage): void {

    }

    private respCode500(response: IncomingMessage): void {

    }

}
