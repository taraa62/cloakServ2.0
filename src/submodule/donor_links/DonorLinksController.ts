import {BaseDonorController, IBaseDonorConfig} from "../BaseDonorController";
import {IResult} from "../../utils/IUtils";
import {DBLinkController} from "./DBLinkController";
import {ILink, Link} from "./Link";
import {StringUtils} from "../../utils/StringUtils";
import {Client} from "../donor_general/item/Client";
import {CONTROLLERS} from "../DonorModule";
import {ItemController} from "../donor_general/ItemController";
import {WorkerActions} from "../donor_general/workers/WorkerActions";


export interface IDonorLinksControllerConfig extends IBaseDonorConfig {
    dbTable: string;
}

export class DonorLinksController extends BaseDonorController {

    private sConf: IDonorLinksControllerConfig;

    private domains: Map<string, Map<string, ILink>>;
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

    /**
     * from edit
     * @param host
     * @param list
     */
    public updateNewLinks(actionWorker: WorkerActions, host: string, list: Map<string, string>): void {
        if (list) {
            this._isBlockUpdDB = true;
            if (!this.domains.has(host)) {
                this.domains.set(host, new Map<string, Link>());
            }
            const map: Map<string, ILink> = this.domains.get(host);
            const sList = this.domains.get(host);
            for (let [action, original] of list) {
                if (!sList.has(action)) {
                    action = actionWorker.checkURLOnBlackParams(original, true);
                    const ind = action.indexOf("#");
                    if (ind > -1) {
                        action = action.substring(0, ind);
                    }

                    const key = this.linkKey + "=" + StringUtils.hashCode(action);

                    if (original.indexOf("21mOLw+nYYL.css,01L8Y-JFEhL.css_.css") > -1) {
                        console.info("******************updateNewLinks link*********************");
                        console.info(`key: ${key}`);
                        console.info(`action: ${action}`);
                        console.info(`request: ${original}`);
                        console.info("******************end updateNewLinks link*********************");
                    }

                    map.set(action, new Link(key, original, action));
                }
            }
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
            const key = this.linkKey + "=" + StringUtils.hashCode(client.action);
            const l = await this.dbController.getInfoByKey(client, key);
            if (client.action.indexOf("21mOLw+nYYL.css,01L8Y-JFEhL.css_.css") > -1) {
                console.info("******************check link*********************");
                console.info(`key: ${key}`);
                console.info(`action: ${client.action}`);
                console.info(`request: ${client.req.originalUrl}`);
                console.info("******************end check link*********************");
            }
            client.originalLink = l;
        } catch (e) {
            this.logger.error(e);
            // console.error(`-------------------ERROR ${e}-----------------`)
        }
        return null;
    }

    public checkRedirectLink(host: string, link: string): string {
        const {key, nLink} = this.getReplUrl(link);
        const list: Map<string, ILink> = new Map<string, ILink>();
        //     list.set(key, new Link(key, link, nLink, link, true)); //TODO, не впевнений на рахунок action=link
        //     this.updateNewLinks(host, list);
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
                if (h.toString() !== "NaN") return h;
            }
        }
        return null;
    }

    public async clearHost(host: string): Promise<IResult> {
        return this.dbController.removeAllRequests(host);
    }


}


