import {IDonorConfigs} from "./DonorConfigsController";
import {FileManager} from "../../utils/FileManager";
import {ServerConfig} from "../../server/ServerConfig";
import {IItemConfig} from "../interface/configs/IConfig";
import {IResult} from "../../utils/IUtils";


export class ReadConfFile {

    constructor(private config: IDonorConfigs, private logger: any) {

    }

    public async check(): Promise<IItemConfig[]> {
        const path: string = FileManager.getSimplePath(this.config.pathToConfFiles, ((<any>process).constant.conf as ServerConfig).dirProject);

        const list: IItemConfig[] = await this.getConfigs(path);
        return list
    }

    private async getConfigs(path: string): Promise<IItemConfig[]> {
        const result: Array<IItemConfig> = [];
        const list:IResult = await FileManager.getFileInFolder(path).catch(er => {
            return null;
        });
        if (list.success && list.data.length > 0) {
            for (let i = 0, y = list.data.length; i < y; i++) {
                try {
                    const v = list.data[i];
                    if (v.info.isFile) {
                        let obj = await FileManager.readFile(v.path).catch(er => {
                            return null
                        });

                        if (obj) {
                            obj = JSON.parse(obj.data.toString());
                            result.push(obj);
                        }
                    }
                } catch (e) {
                    // this.logger.error(e);
                }
            }
        }
        return result;

    }


}
