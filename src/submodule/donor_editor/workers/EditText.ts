import {IMessageWorkerEditTextReq} from "../../interface/IMessageWorkers";
import {IReg, IRegular, IRegulations, IWhere} from "../../interface/configs/IConfig";
import {IResult} from "../../../utils/IUtils";
import {StringUtils} from "../../../utils/StringUtils";
import {EProcessEdit} from "../../interface/EGlobal";
import {WorkEditPage} from "./WorkEditPage";
import {BLogger} from "../../../module/logger/BLogger";
import {JSDOM, VirtualConsole} from "jsdom";


export class EditText {

    private xpath = require("wgxpath");

    constructor(private parent: WorkEditPage, private logger: BLogger) {

    }


    public async edit(reqList: IRegulations[], item: IMessageWorkerEditTextReq, text: string): Promise<IResult> {
        if (text) {
            text = this.replaceLevelText(text, item);
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
                        this.checkLinks(dom1);
                        this.editElemenLevelDom(dom1, sList);
                        this.deleteElementLevelDom(dom1, sList);
                        this.createElementLevelDom(dom1, sList);
                        text = dom1.serialize();

                        this.xpath;
                    }
                }
            }
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
                                            param: "outerHTML",
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


    private replaceLevelText(text: string, item: IMessageWorkerEditTextReq): string {
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
        const defCheckList = ["</html>", "</body>", "</head>"];
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
    private checkDefault(dom: JSDOM, item: IMessageWorkerEditTextReq) {
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
    private createGoogleManager(item: IMessageWorkerEditTextReq): IRegular[] {
        if (item.process === EProcessEdit.PRE && item.googleManagerID) {
            const googleID = item.googleManagerID;
            if (googleID) {
                const topGoogle: IRegular = {
                    isUse: true,
                    process: "pre",
                    event: "c",
                    where: {
                        selector: "head",
                        beforeElm: "firstChild"
                    },
                    append: {
                        text: this.parent.getBaseConfig().topGoogleManager
                    }
                };
                const bottomGoogle: IRegular = {
                    isUse: true,
                    process: "pre",
                    event: "c",
                    where: {
                        selector: "body",
                        beforeElm: "firstChild"
                    },
                    append: {
                        text: this.parent.getBaseConfig().bottomGoogleManager
                    }

                };
                topGoogle.append.text = StringUtils.replaceAll(topGoogle.append.text, "{GOOGLE_ID}", googleID);
                bottomGoogle.append.text = StringUtils.replaceAll(bottomGoogle.append.text, "{GOOGLE_ID}", googleID);

                return [topGoogle, bottomGoogle] as IRegular[];
            }
        }
        return null;
    }

    private checkNodeElemByAttribute(elm: any, attr: any, typeSearch: string, search: string): boolean {
        if (elm && attr && typeSearch && search) {
            if (elm.attributes && elm.attributes[attr]) {
                const text = elm.attributes[attr].value;
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
        }
        return false;
    }


    //**************EDIT************//


    private async checkLinks(dom: JSDOM): Promise<void> {
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
                            const path = await this.linkModule.checkLink(this.parent, val);
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
            let nodes = doc.querySelectorAll(where.selector || where.queryAll);
            let typeSearch = this.getTypeSearch(where);
            if (nodes && nodes.length && typeSearch) {
                for (let node of nodes) {
                    if (this.checkNodeElemByAttribute(node, where.attr, typeSearch, (<any>where)[typeSearch])) {
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
                    } else {
                        if (reg.outerHTML) node.outerHTML = reg.outerHTML;
                        if (reg.innerHTML) node.innerHTML = reg.innerHTML;

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

        };


        for (let t = 0; t < sList.length; t++) {
            try {
                const ed = sList[t];
                if (ed.event == "d") {
                    if (ed.reg.xpath) delXPath(ed.reg);
                    else delWhere(ed.where, ed.reg);
                }
            } catch (e) {
                // console.log(e)
            }
        }
    }

}


