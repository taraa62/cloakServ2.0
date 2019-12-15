import {Client} from "../item/Client";
import {StringUtils} from "../../../utils/StringUtils";
import {BWorker} from "./BWorker";
import * as querystring from "querystring";
import {IncomingHttpHeaders} from "http";
import {TMessageWorkerDonorResp} from "../../interface/TMessageWorkers";

export class WorkerHeaders extends BWorker {


    public getBodyForRequestDonor(client: Client): IncomingHttpHeaders {
        let opt = (client.originalLink) ? this.getHeaderForOriginalLink(client) : this.getHeaderForRequestDonor(client);
        return opt;
    }


    private getHeaderForOriginalLink(client: Client): any {
        const url: URL = new URL(client.originalLink.original);
        const query = client.req.query ? "?" + querystring.stringify(client.req.query) : "";
        const opt: any = {
            headers: {
                "user-agent": 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36'
            },
            host: url.host,
            hostname: url.host,
            method: client.req.method,
            path: url.pathname + query,
            protocol: url.protocol
        };
        Object.assign(opt.headers, client.req.headers);
        opt.headers.host = url.host;
        return this.replaceHeaderForDonor(opt, client);
    }


    private getHeaderForRequestDonor(client: Client): any {
        const query = client.req.query ? "?" + querystring.stringify(client.req.query) : "";
        const opt: any = {
            headers: {
                host: this.parent.getDonorURL().host,
                "user-agent": 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36'
            },
            host: this.parent.getDonorURL().host,
            hostname: this.parent.getDonorURL().host,
            method: client.req.method,
            path: client.req.originalUrl + query,
            protocol: this.parent.getDonorURL().protocolFull
        };
        Object.assign(opt.headers, client.req.headers);


        return this.replaceHeaderForDonor(opt, client);
    }

    public getHeaderForResponseClient(client: Client, mess: TMessageWorkerDonorResp): void {
        if (mess && mess.respHeaders) {
            Object.entries(mess.respHeaders).map(([key, val]) => {
                client.res.setHeader(key, val);
            });
        }
    }

    private replaceHeaderForDonor<T>(opt: any, client: Client): T {

        delete opt.headers['if-none-match'];
        delete opt.headers['if-modified-since'];
        // delete opt.headers['content-length'];
        delete opt.headers['accept-encoding'];
        delete opt.headers['connection'];
        delete opt.headers['cf-cache-status'];

        const accept = opt.headers['accept'];
        if (accept && accept.indexOf("webp")) {
            const arr = accept.split(",");
            const list = arr.filter((v: any) => v.indexOf("webp") < 0);

            opt.headers['accept'] = list.join(',');
        }

        if (client.req.cookies && client.req.cookies instanceof Array) {
            const cookie = Object.assign({}, client.req.cookies);
            opt.headers.cookie = Object.entries(cookie).map(v => v.join("=")).join("; ");

        } else if (client.req.headers.cookie) {
            opt.headers.cookie = client.req.headers.cookie;
        }
        this.replaceObjParam(opt.headers, true);
        return opt;
    }


    public replaceObjParam(obj: any, isReverse: boolean = false): void {
        const check = (v: any) => {
            if (v.constructor.name === "String") {
                return this.replaceStringParam(v, isReverse);
            } else if (v.constructor.name === "Array") {
                return checkArr(v);
            } else {
                return checkObj(v);
            }
        };
        const checkObj = (_ob: any) => {
            Object.keys(_ob).map(key => {
                _ob[key] = check(_ob[key]);
            });
            return _ob;
        };
        const checkArr = (_arr: any[]) => {
            _arr.map((v, v1) => {
                _arr[v1] = check(v);
            });
            return _arr;
        };
        check(obj);

    }

    public replaceStringParam(str: string, isReverse: boolean): string {
        const _repl = (text: string, search: string, toText: string) => {
            if (text && text.indexOf(search) > -1) {
                return StringUtils.replaceAll(text, search, toText);
            }
            return text;
        };
        const numb = Number(str);
        if (!isNaN(numb)) return str;
        if (isReverse) {
            str = _repl(str, this.parent.getOurURL().origin, this.parent.getDonorURL().origin);
            str = _repl(str, this.parent.getOurURL().host, this.parent.getDonorURL().host);
            str = _repl(str, this.parent.getOurURL().domain, this.parent.getDonorURL().domain);
        } else {
            str = _repl(str, this.parent.getDonorURL().origin, this.parent.getOurURL().origin);
            str = _repl(str, this.parent.getDonorURL().host, this.parent.getOurURL().host);
            str = _repl(str, this.parent.getDonorURL().domain, this.parent.getOurURL().domain);
        }
        return str;
    }
}
