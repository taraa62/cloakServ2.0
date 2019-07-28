import {BWorker} from "./BWorker";
import {Client} from "../item/Client";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {IBaseConfig} from "../../interface/configs/IBaseConfig";
import {CONTROLLERS} from "../../DonorModule";
import {DonorLinksController} from "../../donor_links/DonorLinksController";
import {DonorRequestController} from "../../donor_request/DonorRequestController";
import {RequestInfo} from "../../donor_request/RequestInfo";
import {FileManager} from "../../../utils/FileManager";


/**
 * TODO
 * перепровірити чи працює логіка для чорного списку параметрів і кількості .
 */
export class WorkerActions extends BWorker {

    private blackParamForSave: string[];
    private priorityParamForSave: string[];
    private maxUseParamToSave: number = 10;
    private linkController: DonorLinksController;
    private requestController: DonorRequestController;

    public init(): void {
        try {

            this.linkController = this.parent.getDonorController(CONTROLLERS.LINKS) as DonorLinksController;
            this.requestController = this.parent.getDonorController(CONTROLLERS.REQUEST) as DonorRequestController;
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


    public async updAction(client: Client): Promise<void> {
        let url = client.req.originalUrl || client.req.url;

        const info: RequestInfo = await this.requestController.checkRequest(client);
        if (info) {
            if (await FileManager.isExist(info.pathToFile)) {
                client.requestInfo = info;
            } else {
                await this.requestController.removeRequestInfo(client.domainInfo.host, info.action).catch(er => null);
            }
        }
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
                if (file.endsWith(".php")) {
                    isFile = true;
                } else {
                    if (client.req.query) {
                        const query = Object.values(client.req.query).find(val => HeadersUtils.getContentTypeFromOriginalUrl(val as string));
                        if (query) {
                            isFile = true;
                        } else {
                            file = null;
                            isFile = false;
                        }
                    } else {
                        file = null;
                        isFile = false;
                    }
                }
            }
        }
        if (info) {
            client.action = (file) ? file : url;
            client.isFile = isFile;
            return;
        }

        if (!file || url.indexOf("?") > 0) {
            let _url;
            if (url.indexOf("?") > -1) {
                _url = url.substr(0, url.indexOf("?"));
            }
            if (_url && _url.endsWith("/") || url.length > 1 && url.endsWith("/") || client.req.query.length < 1) {
                url += ".html";
            } else {
                if (!isFile) {
                    //url += ".data";
                } else {
                    if (client.req.query) {
                        const list = Object.keys(client.req.query);
                        if (list.length > 0) {
                            const select = [];
                            for (let v in this.priorityParamForSave) {
                                if (list.indexOf(this.priorityParamForSave[v]) > -1) select.push(this.priorityParamForSave[v]);
                            }
                            if (select.length < this.maxUseParamToSave) {
                                select.push(...list);
                            }
                            for (let v in this.blackParamForSave) {
                                const ind = select.indexOf(this.blackParamForSave[v]);
                                if (ind > -1) select.splice(ind, 1);
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
