import {WorkEditPage} from "./WorkEditPage";
import {BLogger} from "../../../module/logger/BLogger";
import {TMessageWorkerEditTextReq} from "../../interface/TMessageWorkers";
import {ILink, Link} from "../../donor_links/Link";
import url from "url";
import {StringUtils} from "../../../utils/StringUtils";

export class LinkEdit {

    private domains: Map<string, ILink> = new Map<string, ILink>();

    constructor(private parent: WorkEditPage, private logger: BLogger) {

    }

    public reset(): void {
        this.domains.clear();
    }

    public getLinks(): Map<string, ILink> {
        return this.domains.size ? this.domains : null;
    }

    public checkLink(item: TMessageWorkerEditTextReq, link: string): string {
        try {
            if (link.startsWith("/")) return link;

            const host = item.ourInfo.host;
            if (!host) return "/";
            if (this.domains.has(link)) return this.domains.get(link).nLink;

            if (link.startsWith("http")) {
                const {key, nLink} = this.getReplUrl(link);

                this.domains.set(link, {key, original: link, nLink, action:item.url} as ILink);
                return nLink;
            }
        } catch (e) {
            this.logger.error(e);
            // console.error(`-------------------ERROR ${e}-----------------`)
        }
        return link;

        return "";
    }


    private getReplUrl(link: string) {
        const key = this.parent.getBaseConfig().linkKey + "=" + StringUtils.hashCode(link);
        const nLink = `/${key}`;
        return {key, nLink};
    }

}
