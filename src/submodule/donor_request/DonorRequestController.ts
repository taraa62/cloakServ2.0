import {BaseDonorController} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {RequestInfo} from "./RequestInfo";
import {DonorRequestDbController} from "./DonorRequestDbController";
import {Client} from "../donor_general/item/Client";
import {TMessageWorkerDonorResp} from "../interface/TMessageWorkers";
import {CONTROLLERS} from "../DonorModule";
import {DonorLinksController} from "../donor_links/DonorLinksController";

export class DonorRequestController extends BaseDonorController {

    private dbController: DonorRequestDbController;


    public async endInit(): Promise<IResult> {
        this.dbController = new DonorRequestDbController(this, this.logger);


        return super.endInit();
    }


    public async checkRequest(client: Client): Promise<RequestInfo> {
        if (client.req.method !== "GET") return null;
        else {
            const hash: number = (<DonorLinksController>this.parent.getController(CONTROLLERS.LINKS)).checkRequeskUrl(client.action || client.req.originalUrl || client.req.url);
            return await this.dbController.getInfoFor(client.domainInfo.host, client.action, hash).catch(er => null);
        }
    }

    public createNewRequestInfo(client: Client, resp: TMessageWorkerDonorResp = null): void {
        const reqInfo = new RequestInfo(client, resp);
        this.dbController.createNewPath(client.domainInfo.host, reqInfo).catch(er => this.logger.error(er));
        client.checkIsEditData();
    }

    public removeRequestInfo(host: string, action: string): Promise<IResult> {
        const hash: number = (<DonorLinksController>this.parent.getController(CONTROLLERS.LINKS)).checkRequeskUrl(action);
        return this.dbController.removeRequest(host, action, hash);
    }

    public async clearHost(host: string): Promise<IResult> {
        return this.dbController.removeAllRequests(host);
    }


    public createNewRequestInfoRedirect(client: Client, resp: TMessageWorkerDonorResp = null): void {
        const reqInfo = new RequestInfo(client, resp);
    }

}
