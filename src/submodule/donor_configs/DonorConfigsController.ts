import {BaseDonorController} from "../BaseDonorController";
import {WorkerOption} from "../../module/workers/WorkerOption";
import {ItemWorker} from "../../module/workers/ItemWorker";
import {FileManager} from "../../utils/InitDefUtils";
import {IDataWorker} from "./IData";

export class DonorConfigsController extends BaseDonorController {

    private worker: ItemWorker;

    protected init() {
        const workPath = FileManager.getSimplePath(__dirname, "/dict/submodule/donor_configs") + "/worker/WorkerController.js";

        const opt: WorkerOption = <WorkerOption>{
            isMessageChannel: true,

        };
        const data: IDataWorker = {
            pathConfigsFolder: "./../libs/configs/",
            db: {
                debug: true,
                url: "testaa"
            }
        }


        this.worker = this.parent.getWorkersModule().addWorker(workPath, data, opt);

    }

}
