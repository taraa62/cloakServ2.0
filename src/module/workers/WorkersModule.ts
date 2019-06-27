import {BModule} from "../BModule";
import {ItemWorker} from "./ItemWorker";
import {WorkerOption} from "./WorkerOption";
import {IResult} from "../../utils/IUtils";

export class WorkersModule extends BModule {

    private listWorker: Map<string, ItemWorker> = new Map();


    public async init(): Promise<any> {
        /*        const confItem: IItemConfig = {
                    domain: "testDomain",
                    nameConfig: "http",
                    protocolServer: "https",
                    isRewrite: false,
                    nameServerConfD: "backend2",
                    pathToResource: "/var/test/test/test"
                };
                const res: any = await NginxUtils.createNginxConfig(confItem);
        */
       return  super.init();
    }


    public addWorker(path: string, data: any, option: WorkerOption = null): ItemWorker {
        option = Object.assign(new WorkerOption(), option);
        const worker: ItemWorker = new ItemWorker(path, data, option);

        this.listWorker.set(worker.getId(), worker);
        return worker;
    }

    public async removeWorker(id: string): Promise<IResult> {
        try {
            if (this.listWorker.has(id)) {
              const iRes:IResult = await this.listWorker.get(id).destroy();
                this.listWorker.delete(id);
                if(iRes.error)return iRes;
            }
        } catch (e) {
            return {error: e};
        }
        return {success: true};
    }


}

