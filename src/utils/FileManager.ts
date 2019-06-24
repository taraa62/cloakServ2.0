import fs from "fs";
import path from "path";
import readline from "readline";
import {Stream} from "stream";
import {IFileInfo, IResult} from "./IUtils";

export class FileManager {

    public static _path: any = path;
    public static _fs: any = fs;


    static async createNewClass<T>(pathTo: string, pathRarent: string = null, ...ags: any[]): Promise<T> {
        try {
            const path = FileManager.getSimplePath(pathTo, pathRarent);
            const _l = await require(path);
            const mod: any = Object.values(_l)[0];
            const res: T = new mod(...ags);
            return res;
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    static backFolder(path: string, num: number): string {
        const arr = path.split(this._path.sep);
        arr.shift();
        if (arr.length > num) {
            arr.splice(arr.length - num, num);
            return "/" + arr.join("/");
        } else return path;
    }

    static getSimplePath(pathTo: string, pathParent: string): string {
        if (!pathTo) pathTo = "";
        if (!pathParent) pathParent = "";
        return this._path.resolve(pathParent, pathTo);
    }

    /**
     * by t62 05.11.2018
     * check the existence of a folder
     * @param pathParent - parent folder (path server.js or other)
     * @param path - check path
     * @param isCreateFolder -
     * returm - is create folder.
     */
    static async checkPathToFolder(pathTo: string, pathParent: string = null, isCreateFolder: boolean = false): Promise<any> {
        return await new Promise(async (res, rj) => {
            const path = this.getSimplePath(pathTo, pathParent);

            if (await this.isExist(path)) res(path);
            else {
                if (!isCreateFolder) rj("folder is not Founde");
                else {
                    const arr = path.split(this._path.sep);
                    let _cD = "";
                    for (const f of arr) {
                        if (f) {
                            _cD += this._path.sep + f;

                            if (!this.isExist(_cD)) {
                                await fs.mkdirSync(_cD);
                            }
                        }
                    }
                    if (_cD === path) res(path);
                    rj("error create folder => " + _cD);
                }
            }
        });
    }

    static isExist(path: string): boolean {
        return fs.existsSync(path);
    }

    static readFile(path: string): Promise<any> {
        return new Promise((res, rej) => {
            fs.readFile(path, (err, data) => {
                if (err) rej(err);
                else res(data);
            });
        });
    }


    // write file//

    static async writeToFile(path: string, text: string, isRewritefile: boolean = true, isCreateFile: boolean = true): Promise<IResult> {
        const info = await FileManager.getInfoFile(path).catch((er: Error) => null);
        if (!info.isFile) return {error: "file is directory"} as IResult;
        if (info) {
            if (!info.isBlockDevice) {
                if (isRewritefile) return await FileManager.rewriteFile(path, text);
                else return FileManager.writeFile(path, text);
            } else return {error: "file is blocker device"} as IResult;
        } else {
            return await FileManager.writeToNewFile(path, text);
        }
    }

    static writeFile(path: string, text: string): Promise<IResult> {
        return new Promise((res, rej) => {
            path = this._path.normalize(path);
            fs.writeFile(path, text, (err) => {
                if (err)
                    rej({error: "Error writing file: " + err});
                else res({success: true} as IResult);
            });
        });
    }


    static rewriteFile(path: string, text: string): Promise<IResult> {
        return new Promise((res, rej) => {
            path = this._path.normalize(path);
            const fd = fs.openSync(path, 'r+');
            fs.ftruncate(fd, 0, (err) => {
                if (err) rej({error: err});
                else {
                    fs.writeFile(path, text, (err) => {
                        if (err)
                            rej({error: "Error writing file: " + err});
                        else res({success: true} as IResult);
                    });
                }
            });
        });
    }

    static async writeToNewFile(path: string, text: string): Promise<IResult> {
        return await new Promise((res, rej) => {
            fs.appendFile(path, text, (err) => {
                if (err) rej({error: err});
                else res({success: true} as IResult);
            });
        });
    }


    static async readLineText(path: string, callback: Function): Promise<any> {
        if (!this.isExist(path)) callback("path is invalid!!!", null, null);
        await this.getInfoFile(path).then((v) => {
            if (v.isFile) {
                const instream = fs.createReadStream(path);
                const outstream: Stream = new Stream();
                const rl = readline.createInterface(instream, outstream as any);

                rl.on('line', (line: string) => {
                    callback(null, line, null);
                });
                rl.on('error', (e: Error) => {
                    callback(e, null, null);
                });
                rl.on('close', (close: any) => {
                    instream.close();
                    rl.close();
                    callback(null, null, true);
                });
            } else {
                callback("file is directory!!!", null, null);
            }
        });
    }


    /*https://nodejs.org/api/fs.html#fs_class_fs_stats */

    static async getInfoFile(path: string): Promise<IFileInfo> {
        return new Promise((res, rej) => {
            fs.stat(path, (err: NodeJS.ErrnoException | null, stats: any) => {
                if (!err) {
                    // noinspection JSAnnotator
                    const obj = {
                        size: stats["size"],
                        mode: stats["mode"],
                        othersExecute: (stats["mode"] & 1) ? 'x' : '-',
                        othersWrite: (stats["mode"] & 2) ? 'w' : '-',
                        othersRead: (stats["mode"] & 4) ? 'r' : '-',
                        groupExecute: (stats["mode"] & 10) ? 'x' : '-',
                        groupWrite: (stats["mode"] & 20) ? 'w' : '-',
                        groupRead: (stats["mode"] & 40) ? 'r' : '-',
                        ownerExecute: (stats["mode"] & 100) ? 'x' : '-',
                        ownerWrite: (stats["mode"] & 200) ? 'w' : '-',
                        ownerRead: (stats["mode"] & 400) ? 'r' : '-',
                        isFile: stats.isFile(),
                        isDirectory: stats.isDirectory(),
                        isBlockDevice: stats.isBlockDevice()
                    };
                    res(obj as IFileInfo);
                } else {
                    rej(err);
                }
            });
        });
    }

}
