import {IMessageWorkerEditTextReq} from "../../interface/IMessageWorkers";
import {IRegular, IRegulations, IWhere} from "../../interface/configs/IConfig";
import {IResult} from "../../../utils/IUtils";
import {StringUtils} from "../../../utils/StringUtils";
import {EProcessEdit} from "../../interface/EGlobal";
import {WorkEditPage} from "./WorkEditPage";
import {BLogger} from "../../../module/logger/BLogger";
import {VirtualConsole, JSDOM} from "jsdom";


export class EditText {

    private  xpath = require("wgxpath");

    constructor(private parent: WorkEditPage, private logger: BLogger) {

    }


    public async edit(reqList: IRegulations[], item: IMessageWorkerEditTextReq, text: string): Promise<IResult> {
        if (text) {
            text = this.replaceLevelText(text, item);
            if (text && this.isHtml(text)) {

                let sList = this.regListToSimpleList(reqList, item.process);
                const defEdit = this.checkDefEdit(item.process, text);
                if (defEdit) {
                    sList = sList.concat(defEdit);
                }

                if (sList.length > 0 || item.process === EProcessEdit.PRE) {
                    text = this._editOnTextLevel(text, sList);

                    const gList = this._createGoogleManager(item.process);
                    if (gList) sList = sList.concat(gList);


                    if (sList.length>0 && item.process === EProcessEdit.PRE) {

                        const virtualConsole = new VirtualConsole();
                        virtualConsole.on("error", (er) => {
                            this.logger.debug(er);
                        });
                        virtualConsole.on("warn", (warm) => {
                            this.logger.debug(warm);
                        });
                        virtualConsole.on("info", (info) => {
                            this.logger.debug(info);
                        });
                        virtualConsole.on("dir", (dir) => {
                            this.logger.debug(dir);
                        });

                        const dom1 = new JSDOM(text, {virtualConsole});

                        this.xpath.install(dom1.window);

                        this._checkDefault(dom1, item.process);
                        this._checkSubDomain(dom1, item.process);
                        this._editTextLevelDom(dom1, sList);
                        this._deleteElementPage(dom1, sList);
                        this._createBlock(dom1, sList);
                        text = dom1.serialize();

                        this.xpath
                    }
                }


            }
        }

        return IResult.succData(text);
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








    private getTypeSearch(where: IWhere) {
        if (where.startsWith) return "startsWith";
        if (where.endsWith) return "endsWith";
        if (where.indexOf) return "indexOf";
        if (where.exactly) return "exactly";
        return null;
    }

}


