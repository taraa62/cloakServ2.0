const {URL} = require('url');
const urlRegex = require('url-regex');
const normalizeUrl = require('normalize-url');
import {Options as NormalizeUrlOptions} from 'normalize-url';

export class StringUtils {
    public static replaceAll(target: string, search: string, replacement: string) {
        if (!target)debugger;
        let res;
        try {
            res = target.replace(new RegExp(search, 'g'), replacement);
        } catch (e) {
            res = target.replace(search, replacement);
        }
        return res ? res : target;
    };

    public static hashCode(target: string): number {
        let hash = 0, i, chr;
        if (target.length === 0) return hash;
        for (i = 0; i < target.length; i++) {
            chr = target.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    //************


    private static getUrlsFromQueryParams(url: string) {
        const ret = new Set();
        const {searchParams} = (new URL(url.replace(/^(\/\/|(www\.))/, 'http://$2')));

        for (const [, value] of searchParams) {
            if (urlRegex({exact: true}).test(value)) {
                ret.add(value);
            }
        }

        return ret;
    };

    public static async replaceText(text: string, options: Options = {}): Promise<Set<string>> {
        if (typeof options.exclude !== 'undefined' && !Array.isArray(options.exclude)) {
            throw new TypeError('The `exclude` option must be an array');
        }

        const ret:Set<string> = new Set();

        const add = (url: any) => {
            try {
                ret.add(normalizeUrl(url.trim().replace(/\.+$/, ''), options));
            } catch (_) {
            }
        };

        const urls = text.match(urlRegex()) || [];
        for (const url of urls) {
            add(url);

            if (options.extractFromQueryString) {
                const qsUrls = this.getUrlsFromQueryParams(url);
                for (const qsUrl of qsUrls) {
                    add(qsUrl);
                }
            }
        }

        for (const excludedItem of options.exclude || []) {
            for (const item of ret) {
                const regex = new RegExp(excludedItem);
                if (regex.test(item as string)) {
                    ret.delete(item);
                    break;
                }
            }
        }

        return ret;
    }


}

export interface Options extends NormalizeUrlOptions {
    /**
     Extract URLs that appear as query parameters in the found URLs.

     @default false
     */
    readonly extractFromQueryString?: boolean;

    /**
     Exclude URLs that match URLs in the given array.

     @default []
     */
    readonly exclude?: string[];
}


