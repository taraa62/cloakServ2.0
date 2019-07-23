import {BaseDonorController} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {RequestInfo} from "./RequestInfo";
import {DonorRequestDbController} from "./DonorRequestDbController";
import {Client} from "../donor_general/item/Client";
import {TMessageWorkerDonorResp} from "../interface/TMessageWorkers";

export class DonorRequestController extends BaseDonorController {

    private dbController: DonorRequestDbController;


    public async endInit(): Promise<IResult> {
        this.dbController = new DonorRequestDbController(this, this.logger);


        return super.endInit();
    }


    public async checkRequest(client: Client): Promise<RequestInfo> {
        if (client.req.method !== "GET") return null;
        else return await this.dbController.getInfoFor(client.domainInfo.host, client.action).catch(er => null);
    }

    public createNewRequestInfo(client: Client, resp: TMessageWorkerDonorResp = null): void {
        const reqInfo = new RequestInfo(client, resp);
        this.dbController.createNewPath(client.domainInfo.host, reqInfo).catch(er => this.logger.error(er));
        client.checkIsEditData();
    }

    public removeRequestInfo(host: string, action: string): Promise<IResult> {
        return this.dbController.removeRequest(host, action);
    }


}
