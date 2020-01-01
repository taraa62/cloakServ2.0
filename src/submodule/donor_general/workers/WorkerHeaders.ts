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
                'access-control-allow-credentials': true,
                "user-agent": 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36'
                // "user-agent":'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
            },
            host: url.host,
            hostname: url.host,
            method: client.req.method,
            path: client.req.originalUrl,
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
                'access-control-allow-credentials': true,
                "user-agent": 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36'
                // "user-agent":'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
            },
            host: this.parent.getDonorURL().host,
            hostname: this.parent.getDonorURL().host,
            method: client.req.method,
            path: client.req.originalUrl,
            protocol: this.parent.getDonorURL().protocolFull
        };
        Object.assign(opt.headers, client.req.headers);


        return this.replaceHeaderForDonor(opt, client);
    }

    public getHeaderForResponseClient(client: Client, mess: TMessageWorkerDonorResp): void {
        if (mess && mess.respHeaders) {
            // (client.res as any)._headers = {};

            const police = mess.respHeaders['content-security-policy'];
            this.replaceObjParam(mess.respHeaders, false);
            if (mess.respHeaders['set-cookie']) {
                mess.respHeaders['set-cookie'].map((v, i) => {
                    mess.respHeaders['set-cookie'][i] = v.replace('instagram.com', 't63.com');
                    // mess.respHeaders['set-cookie'][i] = v.replace('Secure', '');
                   /* const arr = v.split(";");
                    arr.map((v, i) => {
                        // if (v.indexOf('HttpOnly') > -1) arr[i] = null;
                        // if (v.indexOf('Secure') > -1) arr[i] = null;
                        // if (v.indexOf('Domain') > -1) arr[i] = "";
                        // if (v.indexOf('Path') > -1) arr[i] = "Path=/";
                    });
                    const aa: string[] = [];
                    arr.map(v => {
                        if (v) aa.push(v.trim());
                    });*/

                    // aa[0] = arr[0];
                    // aa[1] = 'Path=/';
                    // mess.respHeaders['set-cookie'][i] = aa.join('; ');
                    // mess.respHeaders['set-cookie'][i] =  mess.respHeaders['set-cookie'][i].trim();
                    // console.log(1);
                });
                // client.res.setHeader('cookie', mess.respHeaders['set-cookie'].join("; "));
                // mess.respHeaders['set-cookie'] = null;
            }
            if (mess.respHeaders['content-security-policy']) {
                const arr = (mess.respHeaders['content-security-policy'] as string).split(' ');
                arr.map((v, i) => {
                    if (v.startsWith('https://t63.com')) {
                        arr[i] = v.replace('https://t63.com', 'http://t63.com');
                    }
                    if (v.startsWith('https://*.t63.com')) {
                        arr[i] = v.replace('https://*.t63.com', 'http://*.t63.com');
                    }
                    if (v.startsWith('https:')) {
                        // arr[i] = v.replace('https:', 'http:');
                    }
                });
                mess.respHeaders['content-security-policy'] = arr.join(' ');
            }
            // delete mess.respHeaders['x-content-type-options'];
            // delete mess.respHeaders['vary'];
            // delete mess.respHeaders['Vary'];
            // delete mess.respHeaders['strict-transport-security'];
            // delete mess.respHeaders['x-xss-protection'];
            // delete mess.respHeaders['x-ig-set-www-claim'];
            // delete mess.respHeaders['access-control-expose-headers'];
            // delete mess.respHeaders['x-fb-trip-id'];
            // delete mess.respHeaders['x-frame-options'];
            // delete mess.respHeaders['x-aed'];
            // delete mess.respHeaders['cache-control'];

            // delete mess.respHeaders['set-cookie'];
            // mess.respHeaders['content-security-policy'] = police;

            Object.entries(mess.respHeaders).map(([key, val]) => {
                if (val) client.res.setHeader(key, val);
            });

            // client.res.setHeader('Access-Control-Allow-Credentials', "true");
            // client.res.setHeader('Access-Control-Allow-Origin', "localhost");
            // client.res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
            // client.res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

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
