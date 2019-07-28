import zlib from 'zlib';
import {IncomingHttpHeaders, IncomingMessage} from "http";
import {IResult} from "../../../utils/IUtils";
import {WorkWithDonor} from "./WorkWithDonor";
import {BLogger} from "../../../module/logger/BLogger";
import fs from "fs";
import {TMessageWorkerDonorReq} from "../../interface/TMessageWorkers";
import {StringUtils} from "../../../utils/StringUtils";
import {HeadersUtils} from "../../../utils/HeadersUtils";
import {FileManager} from "../../../utils/FileManager";
import Iconv from 'iconv';

import {decompressStream} from 'iltorb';

export class WorkerFiles {

    constructor(private controller: WorkWithDonor, private logger: BLogger) {

    }


    public saveFileOnDisk(resp: IncomingMessage, data: TMessageWorkerDonorReq): Promise<IResult> {
        return new Promise<IResult>(async (res, rej) => {
                const iRes: IResult = await this.getNameForFile(resp, data);
                if (iRes.error) return rej(iRes);
                if (iRes.msg) return res(IResult.succData(iRes.msg));


                const writeableStream = fs.createWriteStream(iRes.data);
                writeableStream.on("finish", () => {
                    res(IResult.succData(iRes.data));
                }).on('error', (err) => {
                    this.logger.error(`Error write file with donor!!!`, err);
                    rej(IResult.error(err));
                });

                const enc = resp.headers['Content-Encoding'] || resp.headers['content-encoding'];
                const charset: string = this.getCharset(resp.headers).toUpperCase().replace(/^"(.+(?="$))"$/, '$1');
                const iconv: Iconv.Iconv = (charset.startsWith("UTF")) ? null : (data.isEditData) ? new Iconv(charset, 'UTF-8') : null;


                if (enc) {
                    if (enc.indexOf("gzip") > -1) {
                        if (!iconv) resp.pipe(zlib.createUnzip()).pipe(writeableStream);
                        else resp.pipe(zlib.createUnzip()).pipe(iconv).pipe(writeableStream);

                    } else if (enc.indexOf("br") > -1) {
                        if (!iconv) resp.pipe(decompressStream()).pipe(writeableStream);
                        else resp.pipe(decompressStream()).pipe(iconv).pipe(writeableStream);

                    } else if (enc.indexOf("deflate") > -1) {
                        if (!iconv) resp.pipe(zlib.createInflateRaw()).pipe(writeableStream);
                        else resp.pipe(zlib.createInflateRaw()).pipe(iconv).pipe(writeableStream);
                    }
                } else {
                    if (!iconv) resp.pipe(writeableStream);
                    else resp.pipe(iconv).pipe(writeableStream);
                }
            }
        );
    }


    private async getNameForFile(resp: IncomingMessage, data: TMessageWorkerDonorReq): Promise<IResult> {
        try {

           if (data.action.indexOf("index.php") > -1)debugger

            if (data.originalLink) {
                data.action = data.originalLink.action || data.options.path as string;
                if (data.action.endsWith("/")) data.action += "data.html";
            }
            let url = data.action;

            if (url.length > 150) {
                url = this.minimizeUlr(url);
            }
            url = StringUtils.replaceAll(url, "\\?", "");
            url = StringUtils.replaceAll(url, ":", "");
            url = StringUtils.replaceAll(url, "\\\\", "");
            let path = (!data.originalLink) ? `${data.resourceFolder}/${url}` : `${data.resourceFolder}/${data.options.host}/${url}`;
            path = FileManager._path.normalize(path);


            if (await FileManager.isExist(path)) return IResult.succMess(path);
            const iRes: IResult = await FileManager.checkPathToFolder(FileManager.backFolder(path, 1), null, true).catch(e => {
                throw e;
            });
            if (iRes.error) return iRes;
            return IResult.succData(path);
        } catch (e) {
            return IResult.error(e);
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

    private getCharset(headers: IncomingHttpHeaders): string {
        let encod;
        const ct = headers['content-type'];
        if (ct && ct.indexOf("charset") > -1) {
            encod = ct.substring(ct.indexOf("charset") + "charset=".length, ct.length);
        }
        return encod || "utf8";
    }


}
