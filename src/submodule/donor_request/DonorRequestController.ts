import {BaseDonorController} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {MongoDBModule} from "../../module/db/mongo/MongoDBModule";
import {Model} from "mongoose";
import {RequestInfo} from "./RequestInfo";
import crypto from "crypto";
import {IRequestSchema} from "../interface/ISchema";
import {DonorRequestDbController} from "./DonorRequestDbController";
import {Client} from "../donor_general/item/Client";
import {TMessageWorkerDonorResp} from "../interface/TMessageWorkers";

export class DonorRequestController extends BaseDonorController {

    private dbController: DonorRequestDbController;


    public async endInit(): Promise<IResult> {
        this.dbController = new DonorRequestDbController(this, this.logger);


        return super.endInit();
    }


    public async checkRequest(client: Client): Promise<any> {
        if (client.req.method !== "GET") return null;
        else {
            const info: RequestInfo = await this.dbController.getInfoFor(client.domainInfo.host, client.action).catch(er => null);
            client.requestInfo = info;
        }
    }

    public createNewRequestInfo(client: Client, resp:TMessageWorkerDonorResp = null): void {
        const reqInfo = new RequestInfo(client, resp);
        if(client.checkIsEditData()) this.dbController.createNewPath(client.domainInfo.host, reqInfo).catch(er => this.logger.error(er));
    }


}
