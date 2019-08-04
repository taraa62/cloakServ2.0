import {TMessageWorkerEditTextReq} from "../../interface/TMessageWorkers";
import {IReg, IRegular, IRegulations, IWhere} from "../../interface/configs/IConfig";
import {IResult} from "../../../utils/IUtils";
import {StringUtils} from "../../../utils/StringUtils";
import {EProcessEdit} from "../../interface/EGlobal";
import {WorkEditPage} from "./WorkEditPage";
import {BLogger} from "../../../module/logger/BLogger";
import {JSDOM, VirtualConsole} from "jsdom";
import getUrls from "get-urls";
import {Utils} from "tslint";

const urlRegex = require('url-regex');
const normalizeUrl = require('normalize-url');

//https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2019/February/Dashboard/computer120x._CB468850970_SY85_.jpg
export class EditText {

    private xpath = require("wgxpath");

    constructor(private parent: WorkEditPage, private logger: BLogger) {
    }

    public async edit(reqList: IRegulations[], item: TMessageWorkerEditTextReq, text: string): Promise<IResult> {
        try {
            text = await this.checkLinks(text, item).catch(er => {
                this.logger.error(er);
                return null;
            });
            if (text) {
                if (text && this.isHtml(text)) {
                    text = this.stripHtmlComments(text);

                    let sList: IRegular[] = this.regListToSimpleList(reqList, item.process);
                    const defEdit = this.checkDefEdit(item.process, text);
                    if (defEdit) {
                        sList = sList.concat(defEdit);
                    }

                    if (sList.length > 0 || item.process === EProcessEdit.PRE) {
                        text = this.editOnTextLevel(text, sList);

                        const gList: IRegular[] = this.createGoogleManager(item);
                        if (gList) sList = sList.concat(gList);


                        if (sList.length > 0 && item.process === EProcessEdit.PRE) {

                            const virtualConsole = new VirtualConsole();
                            virtualConsole.on("error", (er: Error) => {
                                this.logger.debug(er);
                            });
                            virtualConsole.on("warn", (warm: any) => {
                                this.logger.debug(warm);
                            });
                            virtualConsole.on("info", (info: any) => {
                                this.logger.debug(info);
                            });
                            virtualConsole.on("dir", (dir: any) => {
                                this.logger.debug(dir);
                            });

                            const dom1: JSDOM = new JSDOM(text, {virtualConsole});


                            this.xpath.install(dom1.window);

                            this.checkDefault(dom1, item);
                            // await this.checkLinksElements(dom1, item).catch(er => this.logger.error(er));

                            this.editElemenLevelDom(dom1, sList);
                            this.deleteElementLevelDom(dom1, sList);
                            this.createElementLevelDom(dom1, sList);
                            text = dom1.serialize();
                        }
                    }
                }
                // text = this.replaceLevelText(text, item);
            }
        } catch (e) {
            this.logger.error(e.message || e);
            this.logger.error(e.stack);
        } finally {
            //   this.parent.linkModule.endEditCheckLinks(); //don't await!!!
        }
        return IResult.succData(text);
    }

    private stripHtmlComments(html: string): string {
        return html.replace(/<!--(.*?)-->|(<!--[^]{0,10})|(-->[^]{0,10})/g,
            function(m0, cmt, open, close) {
                if (cmt && cmt.startsWith("[if")) return m0;
                if (open || close) return m0;
                // if (open) throw 'Illegal HTML - no closing comment sequence ("-->") for open at "' + open + '"';
                // if (close) throw 'Illegal HTML - unexpected close comment at "' + close + '"';
                return '';
            }).trim();
    };

    private async checkLinks(text: string, item: TMessageWorkerEditTextReq): Promise<string> {
        if (!text) return text;

        text = StringUtils.replaceAll(text, "%3A%2F%2F", "://");


        return text.replace(urlRegex(), function(m0: string, cmt: any, open: any, close: any) {
            if (m0 && m0.startsWith("/")) return m0;

            if (m0.indexOf("'") > -1) m0 = m0.substring(0, m0.indexOf("'"));
            if (m0.indexOf("\"") > -1) m0 = m0.substring(0, m0.indexOf("\""));
            if (m0.indexOf(")") > -1) m0 = m0.substring(0, m0.indexOf(")"));
            if (m0.indexOf(";") > -1) m0 = m0.substring(0, m0.indexOf(";"));
            if (m0.indexOf("'") > -1)debugger
            const path = this.parent.linkModule.checkLink(item, m0);
            return path;
        }.bind(this)).trim();

        // return text;
    }

    private regListToSimpleList(regList: IRegulations[], cProcess: EProcessEdit): IRegular[] {
        const sList: IRegular[] = [];
        regList.map(v => {
            if (v.regular && v.regular instanceof Array) {
                v.regular.forEach(b => {
                    if (b.isUse === undefined || !!b.isUse) {
                        if (b.process && b.process === cProcess) sList.concat(b);
                    }
                });
            }
        });
        return sList;
    }

    private checkDefEdit(cProcess: EProcessEdit, text: string) {
        if (cProcess === EProcessEdit.PRE) {
            const listEdit: IRegular[] = [];
            try {
                const _check = (list: string[], tag: string) => {
                    if (list && list instanceof Array) {
                        if (list.length > 0) {
                            list.map(v => {
                                if (text.indexOf(v) > -1) {
                                    listEdit.push({
                                        process: "pre",
                                        event: "d",
                                        reg: {
                                            selector: tag
                                        },
                                        where: {
                                            elemParam: "outerHTML",
                                            indexOf: v
                                        }
                                    });
                                }
                            });
                        }
                    }
                };

                //*delete all script element on page
                _check(this.parent.getBaseConfig().listBlackChatLinks, "scripts");
                _check(this.parent.getBaseConfig().listBlackScripts, "scripts");
                _check(this.parent.getBaseConfig().listBlackNoScript, "noscript");
                _check(this.parent.getBaseConfig().listMeta, "meta");
            } catch (e) {
                console.log(e);
            }
            if (listEdit.length > 0) return listEdit;
        }
        return null;
    }

    private replaceLevelText(text: string, item: TMessageWorkerEditTextReq): string {
        text = text.normalize();
        // text = text.replaceAll("http:\\\\/\\\\/", "https://");
        // text = text.replaceAll("http:\\\\/\\\\/", "https://");
        text = text.replace("://://", "://");
        text = StringUtils.replaceAll(text, item.donorInfo.origin, item.ourInfo.origin);
        text = StringUtils.replaceAll(text, item.donorInfo.host, item.ourInfo.host);
        text = StringUtils.replaceAll(text, item.donorInfo.domain, item.ourInfo.domain);
        return text;
    }

    private isHtml(text: string): boolean {
        const defCheckList = ["html>", "body>", "head>"];
        for (let i of defCheckList) {
            if (text.indexOf(i) < 0) return false;
        }
        return true;
    }

    private editOnTextLevel(text: string, sList: IRegular[]): string {
        for (let r = 0; r < sList.length; r++) {
            try {
                if (sList[r].event === "e") {
                    const reg: IReg = sList[r].reg;
                    if (reg.regText && reg.replaceTo) {
                        text = (reg.isReplAll) ? StringUtils.replaceAll(text, reg.regText, reg.replaceTo)
                            : text.replace(new RegExp(reg.regText), reg.replaceTo);
                    }
                }
            } catch (e) {
            }
        }
        return text;
    }

    private getTypeSearch(where: IWhere) {
        if (where.startsWith) return "startsWith";
        if (where.endsWith) return "endsWith";
        if (where.indexOf) return "indexOf";
        if (where.exactly) return "exactly";
        return null;
    }

    /**
     * Check document content charset.
     * @param dom
     * @param item
     */
    private checkDefault(dom: JSDOM, item: TMessageWorkerEditTextReq) {
        if (item.process === EProcessEdit.PRE) {
            const doc = dom.window.document;
            const elem = doc.querySelectorAll("meta");
            if (elem && elem.length > 0) {

                for (let s = 0; s < elem.length; s++) {
                    const x = elem[s];
                    const val = x.getAttribute("content");
                    if (val && val.indexOf("/html") > -1) {
                        const _p = val.split(";")[0] + "; charset=utf8";
                        x.setAttribute("content", _p);
                    }
                }
            }
        }
    }

    /*****CREATE AUTO GOOGLE SCRIPT */
    private createGoogleManager(item: TMessageWorkerEditTextReq): IRegular[] {
        if (item.process === EProcessEdit.PRE && item.googleManagerID) {
            const googleID = item.googleManagerID;
            if (googleID) {
                const topGoogle: IRegular = {
                    isUse: true,
                    process: "pre",
                    event: "c",
                    where: {
                        queryAll: "head",
                        firstElm: true,
                    },
                    append: {
                        outerHTML: this.parent.getBaseConfig().topGoogleManager
                    }
                };
                const bottomGoogle: IRegular = {
                    isUse: true,
                    process: "pre",
                    event: "c",
                    where: {
                        queryAll: "body",
                        firstElm: true,
                    },
                    append: {
                        outerHTML: this.parent.getBaseConfig().bottomGoogleManager
                    }

                };
                topGoogle.append.outerHTML = StringUtils.replaceAll(topGoogle.append.outerHTML, "{GOOGLE_ID}", googleID);
                bottomGoogle.append.outerHTML = StringUtils.replaceAll(bottomGoogle.append.outerHTML, "{GOOGLE_ID}", googleID);

                return [topGoogle, bottomGoogle] as IRegular[];
            }
        }
        return null;
    }

    private checkNodeElemByAttribute(elm: Element, attr: any, typeSearch: string, search: string): boolean {
        if (elm && attr && typeSearch && search) {
            if (elm.attributes && elm.attributes[attr]) {
                const text = elm.attributes[attr].value;
                return this.checkOutherText(text, typeSearch, search);
            }
        }
        return false;
    }

    private checkNodeElemParam(elm: any, paramElem: string, typeSearch: string, search: string): boolean {
        if (elm[paramElem]) {
            const val = elm[paramElem];
            return this.checkOutherText(val, typeSearch, search);
        }
        return false;
    }

    private checkOutherText(text: string, typeSearch: string, search: string): boolean {
        if (text) {
            switch (typeSearch) {
                case "indexOf":
                    return text.indexOf(search) > -1;
                    break;
                case "startsWith":
                    return text.startsWith(search);
                    break;
                case "endsWith":
                    return text.endsWith(search);
                    break;
                case "exactly":
                    return text === search;
            }
        }
        return false;
    }

    private getNodes(doc: Document, where: IWhere): Element[] {
        if (!where.queryAll || !where.id) return [] as any;
        const nodesResult: Element[] = [];

        if (where.id) {
            const node = doc.getElementById(where.id);
            return node ? [] : [node];
        }

        const nodeList: NodeListOf<Element> = doc.querySelectorAll(where.queryAll);

        const typeSearch: string = this.getTypeSearch(where);
        if (!typeSearch) return [...nodeList];

        if (!where.attr && !where.elemParam) return [...nodeList];

        for (let node of nodeList) {
            let _node: Element;
            if (where.attr) {
                if (this.checkNodeElemByAttribute(node, where.attr, typeSearch, (<any>where)[typeSearch])) {
                    _node = node;
                }
            }

            if (where.elemParam) {
                const _n: Element = _node || node;
                if (this.checkNodeElemParam(_n, where.elemParam, typeSearch, (<any>where)[typeSearch])) {
                    _node = _n;
                } else _node = null;
            }
            if (_node) nodesResult.push(_node);
        }
        return nodesResult;
    }

    //**************EDIT************//

    private async checkLinksElements(dom: JSDOM, item: TMessageWorkerEditTextReq): Promise<void> {
        const doc = dom.window.document;

        const checkList = this.parent.getBaseConfig().htmlTagWishLinkUrl;

        for await (let v of checkList) {
            const elem = await doc.querySelectorAll(`[${v}]`);
            if (elem && elem.length > 0) {
                for (let s = 0; s < elem.length; s++) {
                    const x = elem[s];
                    const val = x.getAttribute(v);
                    if (val) {
                        try {
                            const path = await this.parent.linkModule.checkLink(item, val);
                            await x.setAttribute(v, path);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    }

    private editElemenLevelDom(dom1: JSDOM, sList: IRegular[]): void {
        const doc = dom1.window.document;

        const editXpath = (reg: IReg) => {
            if (!reg.replaceTo) return;
            const body = doc.evaluate(reg.xpath, doc.documentElement,
                null, dom1.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (body.singleNodeValue) {
                if (reg.replaceAttr) {
                    if ((<any>body.singleNodeValue).attributes) {
                        (<any>body.singleNodeValue).attributes[reg.replaceAttr].value = reg.replaceTo;
                    }
                } else {
                    body.singleNodeValue.textContent = reg.replaceTo;
                }
            }
        };

        const editWhere = (where: IWhere, reg: IReg) => {
            let nodes: Element[] = this.getNodes(doc, where);

            if (nodes && nodes.length) {
                for (let node of nodes) {
                    if (reg.outerHTML) {
                        node.outerHTML = reg.outerHTML;
                    } else {
                        if (reg.attr) {
                            Object.keys(reg.attr).map(v => {
                                node.setAttribute(v, reg.attr[v]);
                            });
                        }
                        if (reg.innerHTML) {
                            node.innerHTML = reg.innerHTML;
                        }
                    }
                }
            }
        };

        for (let t = 0; t < sList.length; t++) {
            try {
                const ed = sList[t];
                if (ed.event == "e" && ed.reg) {
                    if (ed.reg.xpath) editXpath(ed.reg);
                    else editWhere(ed.where, ed.reg);
                }
            } catch (e) {
                // console.log(e)
            }
        }
    }

    private deleteElementLevelDom(dom1: JSDOM, sList: IRegular[]): void {
        const doc = dom1.window.document;

        const delXPath = (reg: IReg) => {
            const body = doc.evaluate(reg.xpath, doc.documentElement,
                null, dom1.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            body.singleNodeValue.parentElement.removeChild(body.singleNodeValue);
        };

        const delWhere = (where: IWhere, reg: IReg) => {
            const nodes: Element[] = this.getNodes(doc, where);
            for (let node of nodes) {
                try {
                    let parent = node.parentElement;
                    if (where.delParentNum) {
                        const num = (typeof where.delParentNum == "string") ? Number.parseInt(where.delParentNum) : where.delParentNum;
                        for (let ind = 0; ind < num; ind++) {
                            parent = (parent.parentElement) ? parent.parentElement : null;
                        }
                        node = parent;
                        if (node.parentElement) parent = node.parentElement;
                        parent.removeChild(node);

                    } else {
                        parent.removeChild(node);
                    }
                } catch (e) {
                    this.logger.error(e);
                }
            }
        };


        for (let t = 0; t < sList.length; t++) {
            try {
                const ed = sList[t];
                if (ed.event == "d") {
                    if (ed.reg.xpath) delXPath(ed.reg);
                    else delWhere(ed.where, ed.reg);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    private createElementLevelDom(dom1: JSDOM, sList: IRegular[]): void {
        const doc = dom1.window.document;

        const _createOuterHTLM = (v: IRegular, elem: Element) => {
            try {
                if (!elem) return;

                let numCopy: number = (!v.append.numCreate) ? 1 : (typeof v.append.numCreate == "string") ? Number.parseInt(v.append.numCreate) : v.append.numCreate;
                if (numCopy < 1 || isNaN(numCopy)) numCopy = 1;

                let newHtml = '';
                for (let t = 0; t < numCopy; t++) {
                    newHtml += v.append.outerHTML;
                }

                if (v.append.type === 'parent') {
                    elem = elem.parentElement;
                }
                elem.outerHTML = (v.where.firstElm) ? newHtml + elem.outerHTML : elem.outerHTML + newHtml;

            } catch (e) {
                console.log(e);
            }
        };

        const _runAppendString = (v: IRegular) => {
            try {
                const nodes: Element[] = this.getNodes(doc, v.where);

                if (!v.where.lastElm && !v.where.firstElm) return _createOuterHTLM(v, nodes[0]);
                for (let node of nodes) {
                    _createOuterHTLM(v, node);
                }
            } catch (e) {
                console.log(e);
            }
        };


        const _createNode = (v: IRegular, elem: Element) => {
            try {
                const nElem = doc.createElement(v.append.selector);
                if (v.append.attr) {
                    Object.keys(v.append.attr).map(c => nElem.setAttribute(c, v.append.attr[c]));
                }

                if (v.append.innerHtml) {
                    nElem.innerHTML = v.append.innerHtml;
                } else if (v.append.innerText) {
                    const content = doc.createTextNode(v.append.innerText);
                    nElem.appendChild(content);
                }

                const _elem = (v.append.type === "parent") ? elem.parentElement : elem;
                (v.where.firstElm) ? elem.parentElement.insertBefore(nElem, elem.parentElement.firstChild) : elem.appendChild(nElem);

            } catch (e) {
                console.log(e);
            }
        };

        const _runAppendObj = (v: IRegular) => {
            const nodes: Element[] = this.getNodes(doc, v.where);
            for (let s = 0; s < nodes.length; s++) {
                const x = nodes[s];
                _createNode(v, x);
            }
        };

        sList.map(v => {
            try {
                if (v.event === 'c' && v.where && v.append) {
                    if (!v.append.type) v.append.type = "child";

                    if (v.append.outerHTML) _runAppendString(v);
                    else _runAppendObj(v);
                }
            } catch (e) {
                console.log(e);
            }
        });

    }
}
