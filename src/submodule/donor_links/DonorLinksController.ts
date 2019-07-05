import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {DBLinkController} from "./DBLinkController";
import {Link} from "./Link";
import {ItemDomain} from "../donor_general/ItemDomain";
import url from "url";
import {StringUtils} from "../../utils/StringUtils";
import {Client} from "../donor_general/item/Client";


export interface IDonorLinksControllerConfig extends IBaseDonorConfig {
    dbTable: string;
    linkKey: string;
}

export class DonorLinksController extends BaseDonorController {

    private sConf: IDonorLinksControllerConfig;

    private domains: Map<string, Map<string, Link>>;
    private dbController: DBLinkController;

    private _isBlockUpdDB: boolean = false;

    public async init(): Promise<IResult> {
        this.sConf = <IDonorLinksControllerConfig>this.config;

        this.domains = new Map<string, Map<string, Link>>();
        this.dbController = new DBLinkController(this, this.logger, this.sConf);


        return IResult.success;
    }

    public getDomains(): Map<string, Map<string, Link>> {
        return this.domains;
    }

    public get isBlockUpdDB(): boolean {
        return this._isBlockUpdDB;
    }

    /**
     * перевіряємо чи є незбережені лінки в бд.
     * @return {Promise<void>}
     */
    public endEditCheckLinks(): void {
        this._isBlockUpdDB = false;
        const res: Promise<IResult> = this.dbController.updLinkDB().catch(er => IResult.error(er));
        res.then(v => {
            if (v.error) this.logger.error(v.error)
        }).catch(er => this.logger.error(er));
    }

    public checkLink(item: ItemDomain, link: string): string {
        try {
            this._isBlockUpdDB = true;
            // return link; //TODO remove
            const host = item.getMainHost();
            if (!host) return "/";

            if (!this.domains.has(host)) {
                this.domains.set(host, new Map<string, Link>());
            }
            const linkInfo = this.domains.get(host).get(link);

            if (!link) return link;
            if (link.startsWith("/")) {
                if (link.startsWith("//")) {
                    if (link.indexOf("http") > -1) {
                        // throw new Error(link);
                    }
                }
                return link;
            } else {
                if ( link.startsWith("http")) {
                    if (linkInfo) {
                        return linkInfo.nLink;
                    }
                    const {key, nLink} = this.getReplUrl(link);

                    this.domains.get(host).set(link, new Link(key, link, nLink));
                    return nLink;

                }
            }
        } catch (e) {
            this.logger.error(e);
            // console.error(`-------------------ERROR ${e}-----------------`)
        }
        return link;

    }

    private getReplUrl(link: string) {
        const _url = url.parse(link);
        const key = this.sConf.linkKey + "=" + StringUtils.hashCode(link);
        const nLink = `${_url.path}${_url.query ? _url.query + "&" + key : "?"}${key}`;
        return {key, nLink};
    }

    public getLinkInfo(client:Client, host:string) {
        if (client.req.query[this.sConf.linkKey]) {
            const key = this.sConf.linkKey+"=" + client.req.query[this.sConf.linkKey];
            if (this.domains.has(host)) {
                // client.url.searchParams.delete(this.sConf.linkKey);
                client.originalLink = this.domains.get(host).get(key);
            }
        }
    }
}


