import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {DBLinkController} from "./DBLinkController";
import {ILink, Link} from "./Link";
import {StringUtils} from "../../utils/StringUtils";
import {Client} from "../donor_general/item/Client";
import {CONTROLLERS} from "../DonorModule";
import {ItemController} from "../donor_general/ItemController";


export interface IDonorLinksControllerConfig extends IBaseDonorConfig {
    dbTable: string;
}

export class DonorLinksController extends BaseDonorController {

    private sConf: IDonorLinksControllerConfig;

    private domains: Map<string, Map<string, Link>>;
    private dbController: DBLinkController;
    private linkKey: string;
    private _isBlockUpdDB: boolean = false;

    public async init(): Promise<IResult> {
        this.sConf = <IDonorLinksControllerConfig>this.config;

        this.domains = new Map<string, Map<string, Link>>();
        this.dbController = new DBLinkController(this, this.logger, this.sConf);


        return IResult.success;
    }

    public async endInit(): Promise<IResult> {
        this.linkKey = (this.getDonorController(CONTROLLERS.ITEM) as ItemController).getBaseConfig().linkKey;
        return super.endInit();
    }

    public getDomains(): Map<string, Map<string, Link>> {
        return this.domains;
    }

    public get isBlockUpdDB(): boolean {
        return this._isBlockUpdDB;
    }


    public updateNewLinks(host: string, list: Map<string, ILink>): void {
        if (list) {
            this._isBlockUpdDB = true;
            if (!this.domains.has(host)) {
                this.domains.set(host, new Map<string, Link>());
            }
            const map: Map<string, Link> = this.domains.get(host);
            for (let v of list) {
                if (!this.domains.get(host).has(v[1].original)) {
                    map.set(v[1].original, new Link(v[1].key, v[1].original, v[1].nLink, v[1].action));
                }
            }
            ;
            this.endEditCheckLinks();
        }
    }


    /**
     * перевіряємо чи є незбережені лінки в бд.
     * @return {Promise<void>}
     */
    public endEditCheckLinks(): void {
        this._isBlockUpdDB = false;
        const res: Promise<IResult> = this.dbController.updLinkDB().catch(er => IResult.error(er));
        res.then(v => {
            if (v && v.error) this.logger.error(v.error);
        }).catch(er => this.logger.error(er));
    }

    public async checkLink(client: Client): Promise<void> {
        try {
            if (client.req.url.indexOf(this.linkKey) > -1) {
                client.originalLink = await this.dbController.getInfoByLink(client, this.linkKey);

            }
        } catch (e) {
            this.logger.error(e);
            // console.error(`-------------------ERROR ${e}-----------------`)
        }
        return null;
    }

    public checkRedirectLink(host: string, link: string): string {
        const {key, nLink} = this.getReplUrl(link);
        const list: Map<string, ILink> = new Map<string, ILink>();
        list.set(key, new Link(key, link, nLink, link, true)); //TODO, не впевнений на рахунок action=link
        this.updateNewLinks(host, list);
        return nLink;
    }


    private getReplUrl(link: string) {
        const key = this.linkKey + "=" + StringUtils.hashCode(link);
        const nLink = `/${key}`;
        return {key, nLink};
    }

    public getLinkInfo(client: Client, host: string) {
        if (client.req.query[this.linkKey]) {
            const key = this.linkKey + "=" + client.req.query[this.linkKey];
            if (this.domains.has(host)) {
                // client.url.searchParams.delete(this.sConf.linkKey);
                client.originalLink = this.domains.get(host).get(key);
            }
        }
    }


    public checkRequeskUrl(url: string): number {
        if (url.indexOf(this.linkKey) > -1) {
            const arr = url.split("=");
            if (arr.length > 1) {
                const h = Number.parseInt(arr[1]);
                if(h.toString() !== "NaN")return h
            }
        }
        return null;
    }

    public async clearHost(host: string): Promise<IResult> {
        return this.dbController.removeAllRequests(host);
    }


}


