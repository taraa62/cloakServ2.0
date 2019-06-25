import {BModule} from "../module/BModule";

import {DonorConfigsController} from "./donor_configs/DonorConfigsController";
import {BaseDonorController} from "./BaseDonorController";
import {WorkersModule} from "../module/workers/WorkersModule";

export class DonorModule extends BModule {

    private donorControllers: Map<String, BaseDonorController> = new Map<String, BaseDonorController>();
    private workers: WorkersModule;


    init(_wait: Function): void {
        this.workers = this.getModule('workers') as WorkersModule;


        super.init(_wait);
    }

    endInit(): void {
        this.donorControllers.set('conf', new DonorConfigsController(this));

    }

    public getWorkersModule(): WorkersModule {
        return this.workers;
    }
}
