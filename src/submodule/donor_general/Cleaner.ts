import {ItemDomain} from "./ItemDomain";
import {IResult} from "../../utils/IUtils";
import {BLogger} from "../../module/logger/BLogger";
import {FileManager} from "../../utils/FileManager";
import {EResourceFolder} from "../interface/EGlobal";

export class Cleaner {


    public static async check(item: ItemDomain): Promise<IResult> {
        const logger: BLogger = (item as any).logger || console;

        if (item.getDomainConfig().data.cleaner.isClearResourceFolder) {
            this.removeFolder(item.getResourceFolderBy(EResourceFolder.def));
        } else {

        }
        return IResult.success;
    }

    private static removeFolder(path: string): Promise<IResult> {
        return FileManager.removeFileRecursive(path).catch(er => IResult.error(er));
    }

}
