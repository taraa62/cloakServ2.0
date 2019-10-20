import {ItemDomain} from "./ItemDomain";
import {IResult} from "../../utils/IUtils";
import {BLogger} from "../../module/logger/BLogger";
import {EResourceFolder} from "../interface/EGlobal";
import {CONTROLLERS} from "../DonorModule";
import {DonorConfigsController} from "../donor_configs/DonorConfigsController";
import {DonorRequestController} from "../donor_request/DonorRequestController";
import {DonorLinksController} from "../donor_links/DonorLinksController";
import FileManager from "../../utils/FileManager";

export class Cleaner {


    public static async check(item: ItemDomain): Promise<IResult> {
        const logger: BLogger = (item as any).logger || console;

        if (item.getDomainConfig().data.cleaner.isClearAllResource) {
            await this.removeFolder(item.getResourceFolderBy(EResourceFolder.def));
          await (<DonorRequestController>item.getDonorController(CONTROLLERS.REQUEST)).clearHost(item.getDomainConfig().data.ourHost);
          await (<DonorLinksController>item.getDonorController(CONTROLLERS.LINKS)).clearHost(item.getDomainConfig().data.ourHost);
        } else {

        }
        return IResult.success;
    }

    private static removeFolder(path: string): Promise<IResult> {
        return FileManager.removeFileRecursive(path).catch(er => IResult.error(er));
    }

}
