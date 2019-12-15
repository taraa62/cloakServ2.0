import {Request, Response} from "express";
import {WorkerController} from "./WorkerController";
import {Client} from "../item/Client";
import {IResult} from "../../../utils/IUtils";
import {RequestInfo} from "../../donor_request/RequestInfo";
import FileManager from "../../../utils/FileManager";
import {TMessageWorkerDonorReq, TMessageWorkerDonorResp} from "../../interface/TMessageWorkers";
import * as zlib from 'zlib';

//https://lookonmyworks.co.uk/category/express-js/
export class WorkerSubController extends WorkerController {


    public async run(req: Request, res: Response, next: Function): Promise<any> {
        const client: Client = new Client(this, req, res, this.logger, req.header("host"));
        const iRes: IResult = await client.init();
        if (iRes.error) {
            this.logger.error(iRes);
            return res.status(500).send(IResult.resultToString(iRes));
        }

        await this.donorLinkController.checkLink(client);


        const info: RequestInfo = await this.donorRequestController.checkRequest(client).catch(er => null);
        if (info) {
            if (await FileManager.isExist(info.pathToFile)) {
                client.requestInfo = info;
            } else {
                await this.donorRequestController.removeRequestInfo(client.domainInfo.host, info.action).catch(er => null);
            }
        } else {
            if (client.originalLink && client.originalLink.isRunToDonorRequest) {
                return this.responseError404(client);
            }
        }
        //    if (client.requestInfo) return this.responseFile(client, iRes.data);


        if (this.poolWorkWithDonor) {
            // if(client.action.indexOf("index.php")>-1)debugger
            const donorReq: TMessageWorkerDonorReq = {
                command: "setRequest",
                options: this.workerHeaders.getBodyForRequestDonor(client),
                action: client.action,
                resourceFolder: this.getResourceFolderByContentType(client.contentType),
                isEditData: client.isEditBeforeSend,
                originalLink: client.originalLink,
                isSave: client.checkIsSaveFile(),
                body: client.getRequestBody()
            };
            if (req.method.toLocaleUpperCase() === "POST") debugger;


            const iRes: IResult = await this.poolWorkWithDonor.newTask(donorReq).catch(er => IResult.error(er));
            //    if (donorReq.action.indexOf("t64") > -1) debugger;
            if (iRes.success) {
                this.analizeResponseOfDonor(iRes.data, client);
            } else {
                this.responseError(client, IResult.resultToString(iRes), 588);
            }
        } else {
            this.responseError(client, "WorkController:error pool!", 577);
        }

    }

    protected async responseFile(client: Client, resp: TMessageWorkerDonorResp): Promise<any> {

        if (!resp && !client.requestInfo) return this.responseError(client, "close");
        if (!client.contentType) debugger

        const pathToFile = resp ? resp.pathToFile : client.requestInfo.pathToFile;
        this.logger.info(`-----response from file / method: ${client.req.method} time: +${client.getLifeTimeClient()} url: ${client.req.url}`);
        if (client.isEditBeforeSend) {
            if (!resp) resp = {
                pathToFile: pathToFile,
                respCode: 200
            };
            return this.responseData(client, resp);
        }
        client.res.status(200);
        Object.entries(resp.respHeaders).map(([key, val]) => {
            // if (key !== 'access-control-allow-origin')
            //     if (key !== 'access-control-allow-credentials')
                    client.res.setHeader(key, val);
        });

        /*client.res.writeHead(200, {
            'content-type': 'video/mp4',
            'accept-ranges': 'bytes',
            'ETag': '5dab97db-102fa',

            // 'Connection': 'keep-alive',
            'Access-Control-Allow-Headers': 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'


        });
*/

        // client.res.write();
        // client.res.end(data111);


        /* zlib.gzip(data111, function(err, zip) {
             if (err) throw err;

             client.res.writeHead(200, {'content-encoding': 'gzip'});
             client.res.end(zip);
         });*/

        // const stream = FileManager._fs.createReadStream(data111);
        // stream.pipe(client.res);
        // const body = Buffer.from(data111);
        // client.res.setHeader('Content-Length', data111.length);
        client.res.setHeader('Access-Control-Allow-Origin', "http://t63.com");
        client.res.setHeader('ETag', '5dab97db-102fa');
        client.res.end(111);


        /*  const src = FileManager._fs.createReadStream(pathToFile);
     src.on('data', (data: any) => {
         client.res.pipe(data);
     }).on('close', () => {
         client.res.end();
     })          /*
     src.pipe(client.res).on("error", (er: Error) => {

         //TODO remove file and clear request info!!!!!!!
         this.responseError(client, er.message, 533);
     });*/

        return null;
    }


}
