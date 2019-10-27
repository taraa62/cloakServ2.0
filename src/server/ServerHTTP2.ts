import {BaseServer} from "./BaseServer";
import {IResult} from "../utils/IUtils";
import FileManager from "../utils/FileManager";
import * as http2 from 'http2';

const fs = require('fs');
const _path = require('path');
import * as zlib from 'zlib';
import * as http from "http";

export class ServerHTTP2 extends BaseServer {

    private dF: any = {};

    protected upServer(): Promise<IResult> {

        return new Promise<IResult>(async (res, rej) => {
            try {
                const port = this.conf.config.server.port || 8080;


                /* const opt = {
                     key: FileManager._fs.readFileSync(this.conf.dirProject + '/libs/https/key.pem'),
                     cert: FileManager._fs.readFileSync(this.conf.dirProject + '/libs/https/cert.pem'),
                     allowHTTP1: true,
                 };

                 const server = http2.createSecureServer(opt);
                 server.on('error', (err) => console.error(err));

                 server.on('stream', (stream, headers) => {
                     // stream is a Duplex
                     stream.respond({
                         'content-type': 'application/vnd.apple.mpegurl',
                         // 'accept-ranges': 'bytes',
                          'ETag': '5dab97db-102fa',
                         "Content-Length":Buffer.byteLength(data111),
                         ':status': 200,
                         // 'Connection': 'keep-alive',
                         'Access-Control-Allow-Headers':'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'
                     });

                     zlib.gzip(data111, function(err, zip) {
                         if (err) throw err;


                     });
                     stream.end(data111);


                 });*/


                // await FileManager.removeFileRecursive('/home/taraa62/Документы/1/')
                await this.tempFolders();
                this.analizeFiles('/home/taraa62/Документы/1/image');
                // this.getAllFolders();
            } catch (e) {
                rej({error: e});
            }
        });

    }

    private async tempFolders(): Promise<any> {
        await FileManager.checkPathToFolder('./1/image1', '/home/taraa62/Документы', true);
        await FileManager.checkPathToFolder('./1/image2', '/home/taraa62/Документы', true);
        await FileManager.checkPathToFolder('./1/image3', '/home/taraa62/Документы', true);
        await FileManager.checkPathToFolder('./1/image4', '/home/taraa62/Документы', true);
        await FileManager.checkPathToFolder('./1/image5', '/home/taraa62/Документы', true);
        await FileManager.checkPathToFolder('./1/image6', '/home/taraa62/Документы', true);
    }


    private async getAllFolders(): Promise<any> {
        const res: IResult = await FileManager.getFileOnFolder('/home/taraa62/1');
        if (res.success) {

            var tt = res.data.length;
            for (let i = 0; i < tt; i++) {
                await this.analizeFiles(res.data[i].path);
            }
        }
        console.log('---------------end!!!------------------');
        console.log(Object.keys(this.dF));
    }

    private async analizeFiles(path: string): Promise<any> {
        const res: IResult = await FileManager.getFileOnFolder(path, true);
        if (res.success) {

            for (let item of res.data) {
                const move: string = await this.analizeItemFile(item);
                // this.dF[move] = move;
                if (move) {
                    // await this.moveFile(move);
                    await FileManager.removeFile(item.path);
                }
            }

        }
        console.log(`---------------end!!!----${path}--------------`);
    }

    private async analizeItemFile(item: any): Promise<any> {
        const path: string = item.path;
        const size = (item.info.success) ? item.info.data.size : null;
        const fInfo = _path.parse(path);

        if (size > 40000 && fInfo.ext) {
            switch (fInfo.ext) {
                // case '.jpg':
                // case '.jpeg':
                // case '.jp2':
                case '.png':

                    // if (size < 1000000) item.type = 'image1';
                    // else if (size < 1500000) item.type = 'image2';
                    // else if (size < 2000000) item.type = 'image3';
                    // else if (size < 2500000) item.type = 'image4';
                    // else if (size < 3500000) item.type = 'image5';
                    // else  item.type = 'image6';
                    item.type = 'image';
                    break;
                case '.doc':
                case '.docs':
                case '.xls':
                    item.type = 'doc';
                    break;
                case '.pdf':
                    item.type = 'pdf';
                    break;
                case '.mp3':
                    if (size > 5000000) item.type = 'audio';
                    break;
                case '.avi':
                case '.m4p':
                case '.mgp':
                case '.mpg':
                case '.mp4':
                case '.vob':
                    if (size > 5000000) item.type = 'video';
                    break;
            }
            if (item.type) {
                item.fileName = fInfo.base;
                return item;
            }
        }
        return null;
    }

    private async moveFile(item: any): Promise<any> {
        if (!item.type) return null;

        const path = '/home/taraa62/Документы/1/' + item.type + '/' + item.fileName;

        if (!await FileManager.isExist(path)) {
            await fs.copyFileSync(item.path, path, fs.constants.COPYFILE_FICLONE);
        }
        return null;
    }


}

