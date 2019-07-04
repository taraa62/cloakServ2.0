import {IncomingMessage} from "http";
import {IResult} from "../../../utils/IUtils";
import {WorkWithDonor} from "./WorkWithDonor";
import {BLogger} from "../../../module/logger/BLogger";
import fs from "fs";
import {IMessageWorkerDonorReq} from "../../interface/IMessageWorkers";
import {StringUtils} from "../../../utils/StringUtils";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {FileManager} from "../../../utils/FileManager";

export class WorkerFiles {

    constructor(private controller: WorkWithDonor, private logger: BLogger) {
    }


    public saveFileOnDisk(resp: IncomingMessage, data: IMessageWorkerDonorReq): Promise<IResult> {
        return new Promise<IResult>(async (res, rej) => {
            const iRes: IResult = await this.getNameForFile(resp, data);
            if (iRes.error) return rej(iRes);
            if (iRes.msg) return res(IResult.succData(iRes.msg));


            const writeableStream = fs.createWriteStream(iRes.data);
            writeableStream.on("finish", () => {
                res(IResult.succData(iRes.data));
            }).on('error', (err) => {
                this.logger.error(`error write file!!!`, err);
                rej(IResult.error(err));
            });
            resp.pipe(writeableStream);
        })
    }


    private async getNameForFile(resp: IncomingMessage, data: IMessageWorkerDonorReq): Promise<IResult> {
        try {
            /*if (client.subDomain) {
                return await this.parent.workSubDomain.getNameForFile(client);
            }*/
            let url = data.action;
            let path;
            const ctResp = HeadersUtils.getContentTypeOrAcceptHTTP(resp.headers);
            if (ctResp) {
                const form = ctResp.split("/")
                if (form.length > 1) {
                    if (!data.action.endsWith(form[1])) {
                        const ind = data.action.indexOf(".");
                        if (ind > -1) {
                            url = data.action.substr(0, ind) + "." + form[1];
                        }
                    }
                }
            }

            if (url.length > 150) {
                url = this.minimizeUlr(url);
            }
            url = StringUtils.replaceAll(url, "\\?", "")
            url = StringUtils.replaceAll(url, ":", "")
            url = StringUtils.replaceAll(url, "\\\\", "")
            path = `${data.resourceFolder}/${url}`;
            path = FileManager._path.normalize(path);


            if (await FileManager.isExist(path)) return IResult.succMess(path);
            const iRes: IResult = await FileManager.checkPathToFolder(FileManager.backFolder(path, 1), null, true).catch(e => {
                throw e
            });
            if (iRes.error) return iRes;
            return IResult.succData(path);
        } catch (e) {
            return IResult.error(e)
        }
    }

    private minimizeUlr(url: string): string {
        const getFirstNameFile = () => {
            const ind = url.indexOf(".");
            if (ind < 147) {
                return url.substr(0, ind + 3);
            } else return null;

        };

        let newUrl = getFirstNameFile();
        if (!newUrl) {
            newUrl = "autoGenerateName:" + url.substr(0, 50);
        }
        return newUrl;
    }


}
