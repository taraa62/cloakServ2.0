import {DonorLinksController, IDonorLinksControllerConfig} from "./DonorLinksController";
import {BLogger} from "../../module/logger/BLogger";
import {MongoDBModule} from "../../module/db/mongo/MongoDBModule";
import {Model} from "mongoose";

import {IResult} from "../../utils/IUtils";
import {Client} from "../donor_general/item/Client";
import {ILink, Link} from "./Link";

export class DBLinkController {

    private db: MongoDBModule;
    private linkModel: Model<any>;

    constructor(private parent: DonorLinksController, private logger: BLogger, private sConf: IDonorLinksControllerConfig) {
        this.db = parent.getModule("mongodb") as MongoDBModule;
        const linkSchema = require("./linkSchema");
        this.linkModel = this.db.getModel(sConf.dbTable, linkSchema);
        this.updateLinkInfo();
    }

    private async updateLinkInfo(): Promise<void> {
        const links: IResult = await this.db.query(this.linkModel, {});

        if (links.success && links.data.length > 0) {
          //  const domains = this.parent.getDomains();

            const arr: any[] = links.data;
            arr.map((v: any) => {
                const links = {};
                Object.entries(v.info).forEach((v) => {
                    arr[(<any>v[1]).original] = v[1];
                });
                //     domains.set(v.domain, arr);
            });
        }
    }

    public async updLinkDB(): Promise<IResult> {
        if (this.parent.isBlockUpdDB) return;

        const domains = this.parent.getDomains();
        if (domains) {
            for (const [key, val] of domains.entries()) {
                /**check exist domain*/
                /*              const exist = await this.db.update(this.linkModel, {domain: key} as any, {
                                  domain: key,
                                  info: {}
                              }, {upsert: true, strict: false}).catch(err => {
                                  this.logger.error(err);
                                  return null;
                              });
                              if (!exist) return null;
              */

                val.forEach(async info => {
                    if (!info.isCreateDB) {
                        info.isCreateDB = true;
                        const _data = `info.${info.key}`;
                        const data = {[_data]: info};

                        const find: any = {domain: key};

                        await this.db.update(this.linkModel, find, data, {upsert: true, strict: false}).catch(err => {
                            this.logger.error(err);
                            info.isCreateDB = false;
                        });
                    }
                });
            }
        }
    }

    public async getInfoByLink(client: Client, linkKey: string): Promise<ILink> {
        const params: string[] = (Object.keys(client.req.query).length > 0) ? Object.values(client.req.query) : Object.values(client.req.params);
        let key;
        let check = linkKey + "=";
        for (let i = 0; i < params.length; i++) {
            if (params[i].includes(linkKey)) {
                key = params[i].substr(1, params[i].length);
                if (!key.startsWith(check)) key = null;
            }
        }
        if (key) {
            const _data = `info.${key}.key`;
            //  const data = {[_data]: key};

            const find = {
                domain: client.domainInfo.host,
                [_data]: key
            };
            const keyOpt = `info.${key}`;
            const opt: any = {[keyOpt]: 1};
            const res: IResult = await this.db.query(this.linkModel, find, opt)
                .then(v => {
                    if (v.data instanceof Array && v.data.length < 1) return IResult.succData(null);
                    return v;
                }).catch(er => {
                    return IResult.succData(null);
                });
            if (res.data) {
                return res.data[0].info[key];
            }
        }
        return null;
    }

    async removeAllRequests(domain: string): Promise<IResult> {
        return await this.db.remove(this.linkModel, {domain: domain}).catch(er => {
            return IResult.error(er);
        });
    }
}
