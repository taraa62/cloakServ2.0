import {BWorker} from "./BWorker";
import {Client} from "../item/Client";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {IBaseConfig} from "../../interface/configs/IBaseConfig";


/**
 * TODO
 * перепровірити чи працює логіка для чорного списку параметрів і кількості .
 */
export class WorkerActions extends BWorker {

    private blackParamForSave: string[];
    private priorityParamForSave: string[];
    private maxUseParamToSave: number = 10;

    public init(): void {
        try {
            this.blackParamForSave = [];
            this.priorityParamForSave = [];

            const baseConf: IBaseConfig = this.parent.getBaseConf();
            this.maxUseParamToSave = baseConf.maxUseParamForSaveFile || 2;

            Object.assign(this.blackParamForSave, baseConf.blackParamForSave);
            Object.assign(this.blackParamForSave, this.parent.getDomainConfig().data.blackParamForSave || []);

            Object.assign(this.priorityParamForSave, baseConf.prioritySaveParam);
            Object.assign(this.priorityParamForSave, this.parent.getDomainConfig().data.prioritySaveParam);


        } catch (e) {
            this.logger.error(e);
        }
    }


    public updAction(client: Client): void {
        let url = client.req.originalUrl || client.req.url;
        if (url.length < 1) url = "/";

        if (url.endsWith("?")) {
            url = url.substr(0, url.length - 1);
        }
        if (url.endsWith("/")) {
            url += "index.html";
        }
        if (url.startsWith("/")) url = url.substr(1, url.length);
        url = url.toLocaleLowerCase();

        let isFile = false;
        let file;
        if (url.indexOf(".") > -1) {
            const indParam = url.indexOf("?");
            file = (indParam > -1) ? url.substr(0, indParam) : url;
            isFile = true;
            if (!HeadersUtils.getContentTypeFromOriginalUrl(file)) {
                file = null;
                isFile = false;
            }
        }
        if (!file) {
            let _url;
            if (url.indexOf("?") > -1) {
                _url = url.substr(0, url.indexOf("?"));
            }
            if (_url && _url.endsWith("/") || url.length > 1 && url.endsWith("/") || client.req.query.length < 1) {
                url += ".html";
            } else {
                if (!isFile) {
                    url += ".data";
                } else {
                    if (client.req.query) {
                        const list = Object.keys(client.req.query);
                        if (list.length > 0) {
                            const select = [];
                            for (let v in this.priorityParamForSave) {
                                if (list.indexOf(this.priorityParamForSave[v]) > -1) select.push(this.priorityParamForSave[v]);
                            }

                            let params = "";
                            select.forEach((v) => {
                                params += `&${v}=${client.req.query[v]}`;
                            });
                            url = file + params;
                        }
                    }
                }
            }
        } else {
            client.action = file;
            client.isFile = isFile;
            return;
        }
        client.action = url;
        client.isFile = isFile;
    }




}
