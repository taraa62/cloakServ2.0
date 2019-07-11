import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {ReadConfFile} from "./ReadConfFile";
import {MongoDBModule} from "../../module/db/mongo/MongoDBModule";
import {configSchema} from "./configSchema";
import {Model} from "mongoose";
import {IItemConfig} from "../interface/configs/IConfig";
import {IResult} from "../../utils/IUtils";
import {ObjectId} from "mongodb";


export interface IDonorConfigs extends IBaseDonorConfig {
    pathToConfFiles: string;
    dbTable: string;
    isUpdateConfWithFile: boolean;
    isClearAllConfigsDB: boolean;
}

/*
    Working in main thread
 */
export class DonorConfigsController extends BaseDonorController {


    //private workers: ItemWorker;
    private sConfig: IDonorConfigs;
    private db: MongoDBModule;
    private confSchema = configSchema;
    private confModel: Model<any>;


    public async init(): Promise<IResult> {
        this.sConfig = this.config as IDonorConfigs;
        this.db = this.parent.getModule("mongodb") as MongoDBModule;
        this.confModel = this.db.getModel(this.sConfig.dbTable, configSchema);

        let fileCont: IItemConfig[];
        if (this.sConfig.isClearAllConfigsDB) {
            await this.db.clearDB(this.confModel).then(v => this.logger.info("all configs in db to clear")).catch(er => {
                this.logger.error("error clear db from configs ", er);
            })
        }
        if (this.sConfig.isUpdateConfWithFile) {
            fileCont = await new ReadConfFile(this.sConfig, this.logger).check();
        }

        if (fileCont && fileCont.length > 0) {
            for (let i = 0; i < fileCont.length; i++) {
               const res =  await this.createNewConfig(fileCont[i]);

               // console.log(111)
            }
        }
        return super.init()
    }


    public async createNewConfig(conf: IItemConfig) {
        const saveList: IItemConfig[] = await this.findConfigByDonorAndOurHost(conf.data.donorOrigin, conf.data.ourHost, conf.data.nameResourceFolder);
        if (!this.sConfig.isUpdateConfWithFile && (!saveList || saveList && saveList.length > 0)) {
            return "config is exist!"
        } else {
            await this.checkCleaner(conf, saveList);

            return await this.db.insert(this.confModel, conf).catch(err => {
                this.logger.error(err);
                return err;
            });
        }
        return null;
    }

    private async checkCleaner(conf: IItemConfig, list: IItemConfig[]): Promise<void> {
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const iRes: IResult = await this.removeConfig(list[i]._id.toString())
                if (iRes.error) this.logger.error(iRes.error);
            }
        }
    }


    //****** FIND*******//
    public async findConfigByID(id: string): Promise<IItemConfig> {
        const iRes: IResult = await this.db.query(this.confModel, {_id: this.db.getObjectID(id)});
        if (iRes.success) return iRes.data;
        return null;
    }

    public async findConfigCloneID(id: string | ObjectId): Promise<IItemConfig> {
        const iRes: IResult = await this.db.query(this.confModel, {cloneID: id});
        if (iRes.success) return iRes.data;
        return null;
    }


    public async findConfigByDonorHost(host: string): Promise<IItemConfig> {
        const iRes: IResult = await this.db.query(this.confModel, {"data.donorOrigin": host});
        if (iRes.success) return iRes.data;
        return null;
    }

    public async findConfigByOurHost(host: string): Promise<IItemConfig> {
        const iRes: IResult = await this.db.query(this.confModel, {"data.ourHost": host});
        if (iRes.success) return iRes.data;
        return null;
    }

    public async findConfigByDonorAndOurHost(donor: string, host: string, pathResource: string): Promise<IItemConfig[]> {
        const iRes: IResult = await this.db.query(this.confModel, {
            $and: [
                {"data.donorOrigin": donor},
                {"data.ourHost": host},
                {"data.nameResourceFolder": pathResource}]
        });
        if (iRes.success) return iRes.data;
        return null;
    }

    public async getUseConfigs(): Promise<IItemConfig[]> {
        const iRes: IResult = await this.db.query(this.confModel, {"isUse": true});
        if (iRes.success) return iRes.data;
        return [];
    }

    public async getAllConfigs(): Promise<IItemConfig[]> {
        const iRes: IResult = await this.db.query(this.confModel, {});
        if (iRes.success) return iRes.data;
        return [];
    }

    public async removeConfig(id: string | ObjectId): Promise<IResult> {
        if (id instanceof String) id = this.db.getObjectID(id as string);
        return await this.db.remove(this.confModel, {_id: id})
    }


    /*  private testWorker() {
          const workPath = FileManager.getSimplePath(__dirname, "/dict/submodule/donor_configs") + "/workers/WorkerController.js";

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


          this.workers = this.parent.getWorkersModule().addWorker(workPath, data, opt);

      }
  */
}
