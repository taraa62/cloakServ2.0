import {DonorLinksController, IDonorLinksControllerConfig} from "./DonorLinksController";
import {BLogger} from "../../module/logger/BLogger";
import {MongoDBModule} from "../../module/db/mongo/MongoDBModule";
import {Model} from "mongoose";
import {configSchema} from "../donor_configs/configSchema";
import {IResult} from "../../utils/IUtils";

export class DBLinkController {

    private db: MongoDBModule;
    private linkModel: Model<any>

    constructor(private parent: DonorLinksController, private logger: BLogger, private sConf: IDonorLinksControllerConfig) {
        this.db = parent.getModule("mongodb") as MongoDBModule;
        const linkSchema = require("./linkSchema");
        this.linkModel = this.db.getModel(sConf.dbTable, configSchema);
        this.updateLinkInfo();
    }
    private async updateLinkInfo():Promise<void> {
        const links:IResult = await this.db.query(this.linkModel, {});

        if (links.success && links.data.length > 0) {
            const domains = this.parent.getDomains();

            const arr:any[] = links.data;
            arr.map((v:any) => {
                const links = {};
                Object.entries(v.info).forEach((v) => {
                    arr[(<any>v[1]).original] = v[1];
                })
           //     domains.set(v.domain, arr);
            })
            console.log(11);
        }
    }

   public async updLinkDB():Promise<IResult> {
        if (this.parent.isBlockUpdDB) return;

        const domains = this.parent.getDomains();
        if (domains) {
            for (const [key, val] of domains.entries()) {
                /**check exist domain*/
                const exist = await this.db.update(this.linkModel, {domain: key}, {
                    domain: key,
                    links: {}
                }, {upsert: true}).catch(err => {
                    this.logger.error(err);
                    return null;
                });
                if (!exist) return null;

                Object.values(val).map(async info => {
                    if (!info.isCreateDB) {
                        info.isCreateDB = true;
                        const _data = `info.${info.key}`;
                        const data = {[_data]: info};

                        await this.db.update(this.linkModel, {domain: key}, data, {upsert: true}).catch(err => {
                            this.logger.error(err);
                            info.isCreateDB = false;
                        });
                    }
                })
            }
        }


    }

}
