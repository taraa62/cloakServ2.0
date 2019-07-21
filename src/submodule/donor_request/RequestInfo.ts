import {Client} from "../donor_general/item/Client";

export class RequestInfo {
    public pathToFile: string;
    public originURL: string;
    public action: string;
    public contentType: string;

    public shelfLife: string;
    public shelfLifeType: string;
    public shelfLifeAutoIndex: number;

    constructor(client: Client = null) {
        if (client) {
            this.action = client.action;
            this.contentType = client.contentType;
            this.originURL = client.req.url;     //якщо є параметри з чоного списку, то наступний запит може відрізнятись від цього
            this.pathToFile = client.pathToFile;
        }
    }
}
