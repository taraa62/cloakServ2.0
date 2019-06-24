import {BModule} from "../BModule";
import {ItemWorker} from "./ItemWorker";
import {WorkerOption} from "./WorkerOption";

export class WorkersModule extends BModule {

    private listWorker: Map<string, ItemWorker> = new Map();

    public addWorker(path: string, data: any, option: WorkerOption = null): void {
        option = Object.assign(new WorkerOption(), option);
        const worker = new ItemWorker(path, data, option);

        this.listWorker.set(worker.getId(), worker);
    }


}

