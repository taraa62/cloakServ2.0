import {Client} from "../donor_general/item/Client";
import {TMessageWorkerDonorResp} from "../interface/TMessageWorkers";

export class RequestInfo {
    public pathToFile: string;
    public originURL: string;
    public action: string;
    public contentType: string;

    public shelfLife: string;
    public shelfLifeType: string;
    public shelfLifeAutoIndex: number;

    constructor(client: Client = null, resp: TMessageWorkerDonorResp = null) {
        if (resp) {
            if (!resp.error) {
                this.pathToFile = resp.pathToFile;
                if (resp.respHeaders["content-type"] && client.contentType !== resp.respHeaders["content-type"]) client.contentType = resp.respHeaders["content-type"];
            }
        }

        if (client) {
            this.action = client.action;
            this.contentType = client.contentType;
            this.originURL = client.req.url;     //якщо є параметри з чоного списку, то наступний запит може відрізнятись від цього
        }
    }
}
