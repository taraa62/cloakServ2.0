import {WorkEditPage} from "./WorkEditPage";
import {BLogger} from "../../../module/logger/BLogger";
import {TMessageWorkerEditTextReq} from "../../interface/TMessageWorkers";

export class LinkEdit {

    private domains: Map<string, string> = new Map<string, string>();

    constructor(private parent: WorkEditPage, private logger: BLogger) {

    }

    public reset(): void {
        this.domains.clear();
    }

    public getLinks(): Map<string, string> {
        return this.domains.size ? this.domains : null;
    }


    public checkLink(item: TMessageWorkerEditTextReq, url: string, isSaveSubDomain = false): string {
        try {
            if (url.startsWith("/")) return url;

            const host = item.ourInfo.host;
            if (!host) return "/";

            if (this.domains.has(url)) return this.domains.get(url);

            if (url.startsWith("http")) {
                const uu = new URL(url);
                // const act = url.substr(url.indexOf(uu.host) + uu.host.length, url.length);
                const act = uu.pathname + uu.search;

                if (!isSaveSubDomain) uu.hostname = host;
                else {
                    uu.hostname = uu.hostname.replace(item.donorInfo.domain, item.ourInfo.domain);
                }
                uu.protocol = item.ourInfo.protocol;

                this.domains.set(act, url);
                return uu.href;
            }
        } catch (e) {
            this.logger.error(e);
            // console.error(`-------------------ERROR ${e}-----------------`)
        }
        return url;
    }


}
