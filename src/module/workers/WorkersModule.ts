import {BModule} from "../BModule";
import {ItemWorker} from "./ItemWorker";
import {WorkerOption} from "./WorkerOption";
import {NginxUtils} from "../../utils/NginxUtils";
import {IResult} from "../../utils/IUtils";

export class WorkersModule extends BModule {

    private listWorker: Map<string, ItemWorker> = new Map();


    async init(_wait: Function): Promise<any> {
        const res: IResult = await NginxUtils.checkRun();

        super.init(_wait);
    }


    public addWorker(path: string, data: any, option: WorkerOption = null): void {
        option = Object.assign(new WorkerOption(), option);
        const worker = new ItemWorker(path, data, option);

        this.listWorker.set(worker.getId(), worker);
    }


}

