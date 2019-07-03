import {IncomingHttpHeaders, IncomingMessage} from "http";

export class HeadersUtils {

    public static contentTypes = require("./content-type");

    /**
     It's for checking all variants to get content-type
     */
    public static getContentTypeFromRequest(req: IncomingMessage): string {
        let ct: string = this.getContentTypeOrAcceptHTTP(req.headers);
        if (!ct) return this.getContentTypeFromOriginalUrl((<any>req).originalUrl);
        return null;
    }

    public static getContentTypeOrAcceptHTTP(headers: IncomingHttpHeaders): string {
        if (headers['content-type']) {
            let ct = headers['content-type'].split(";")[0];
            if (ct) {
                return ct;
            }
        } else if (headers['accept']) {
            let ct = headers['accept'].split(",")[0];
            if (ct !== "/") {
                return ct;
            }
        }
        return null;
    }

    public static getContentTypeFromOriginalUrl(url: string): string {
        if (url.indexOf("?") > -1) {
            url = url.substr(0, url.indexOf("?"));
        }
        return this.contentTypes.getContentTypeWithPath(url);
    }

}
