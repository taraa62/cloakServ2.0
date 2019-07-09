import {BaseDonorController} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {MongoDBModule} from "../../module/db/mongo/MongoDBModule";
import {Model} from "mongoose";
import {RequestInfo} from "./RequestInfo";
import crypto from "crypto";
import {IRequestSchema} from "../interface/ISchema";

export class DonorRequestController extends BaseDonorController {

    private db: MongoDBModule;
    private requestModel: Model<any>;

    public async endInit(): Promise<IResult> {
        this.db = this.getModule("mongodb") as MongoDBModule;
        const requestSchema = require("./requestSchema");
        this.requestModel = this.db.getModel("RequestModel", requestSchema);

        return super.endInit();
    }


    public async createNewPath(domain: string, requestInfo: RequestInfo): Promise<IResult> {
        const action = this.getKeyForAction(requestInfo.action);

        const info = `info.${action}`;
        const upd = {[info]: requestInfo};

        return await this.db.update(this.requestModel, <any>{domain: domain}, upd, {upsert: true}).catch((er: Error) => {
            this.logger.error(er)
            return IResult.error(er);
        });
    }

    public async getInfoFor(domain: string, action: string) {
        const [hash, query] = this.getOptForFindAction(domain, action);

        const keyOpt = `info.${hash}`;
        const opt = {[keyOpt]: 1};

        const info = await this.db.query(this.requestModel, query, true, opt).then(v => {
            try {
                if (v.error) return v;
                const arr: IRequestSchema[] = v.data;
                return (arr.length > 0) ? arr[0].info[hash] : IResult.error;
            } catch (e) {
                return IResult.error(e);
            }

        }).catch(er => {
            return {error: er}
        });
        return info;
    }

    public async removeRequest(domain: string, action: string): Promise<IResult> {
        const [hash, query] = this.getOptForFindAction(domain, action);

        return await this.db.remove(this.requestModel, query).catch(er => {
            return IResult.error(er);
        });
    }

    async removeAllRequests(domain: string): Promise<IResult> {
        return await this.db.remove(this.requestModel, {domain: domain}).catch(er => {
            return IResult.error(er);
        });
    }

    private getKeyForAction(action: string): string {
        action = crypto.createHash('md5').update(action).digest("hex").toString();
        action = action.substr(0, 16);
        return action;
    }

    private getOptForFindAction<T extends Array<any>>(domain: string, action: string): T {
        const hash = this.getKeyForAction(action);
        const key = `info.${hash}.action`;
        const query = {[key]: action};
        const opt = {$and: [{domain: domain}, query]}
        return <T>[hash, opt];
    }
}
