import fs from "fs";
import path from "path";

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
        if(!pathTo)pathTo = "";
        if(!pathParent)pathParent = "";
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

}
