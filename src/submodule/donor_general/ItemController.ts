import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {IBaseConfig} from "../donor_configs/IBaseConfig";
import {FileManager} from "../../utils/FileManager";


export interface IItemController extends IBaseDonorConfig {
    baseConfig: string
}

export class ItemController extends BaseDonorController {

    private sConf: IItemController;

    public async init(): Promise<IResult> {
        try {
            this.sConf = <IItemController>this.config;

            const baseConfig = await this.loadBaseConfig();
            if(!baseConfig)return IResult.error("base config isn't load")
        } catch (e) {
            return IResult.error(e);
        }

        return IResult.success;
    }

    private async loadBaseConfig(): Promise<IBaseConfig> {
        const path: string = FileManager.getSimplePath(__dirname, this.sConf.baseConfig );
        const ires: IResult = await FileManager.readFile(path).catch(e => {
         //   this.logger.error(e);
            return IResult.error(e);
        })
        if (ires.success) return ires.data;
        return null;
    }


}
