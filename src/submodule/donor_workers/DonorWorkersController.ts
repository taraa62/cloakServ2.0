/*
controller for work with donor.
 */
import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";


/**
 * TODO
 * потрібно добавити котроллер перевірки надходження нових задач і задач які в роботі.
 * тобто якщо один із воркерів грузить файл, то потрібно знайти цю задачу і ждати івента його закінчення.
 *
 * перевірку робити може по шляху файла , куда буде збережений файл.
 *
 */

export interface IDonorWorkersControllerConfig extends IBaseDonorConfig {
    name: string
    jsFile: string
}

export class DonorWorkersController extends BaseDonorController {

    private sConf: IDonorWorkersControllerConfig;


    public async init(): Promise<IResult> {
        this.sConf = <IDonorWorkersControllerConfig>this.config;

        super.createPool(this.sConf.jsFile, this.sConf.name, null, "plural");

        // TestPool.testSizePool();

        return IResult.success;
    }


}
