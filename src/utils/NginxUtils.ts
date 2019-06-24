import {FileManager} from "./FileManager";
import {IResult} from "./IUtils";
import {CDMCommand, CMDResult} from "./cmd/CMDResult";
import {CMDUtils} from "./cmd/CMDUtils";

export class NginxUtils {


    public static checkNginxPid(): void {
        const _check = (path: string, search: string) => {
            let text = "";
            let isRewrite = false;
            let isErr = false;
            FileManager.readLineText(path, (err: Error, line: string, close: any) => {
                if (err) {
                    isErr = true;
                    return;
                } else if (line) {
                    if (line.indexOf(search) > -1 && !line.startsWith("#")) {
                        line = "#" + line;
                        isRewrite = true;
                    }
                    text += line + "\n";
                } else if (close) {
                    if (!isErr && isRewrite) {
                        FileManager.rewriteFile(path, text);
                    }
                } else {
                    text += "\n";
                    // this.logger.error(`error=> ${err} line => ${line}  close => ${close}`)
                }
            });

        };
    }

    /*
    check status activ nginx, if status !==0, start nginx.
     */
    public static async checkRun(): Promise<IResult> {
        let status: IResult = await this.statusNginx();
        if (status.code !== 0) {
            status = await this.startNginx();
        }
        return status;
    }

    /**
     * error code: if 0- nginx activ, 3 - stop
     */
    public static async statusNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.STATUS_NGINX);
        const ires: IResult = this.getResult(result);
        return ires;
    }


    public static async stopNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.STOP_NGINX);
        return this.getResult(result);
    }

    public static async startNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.START_NGINX);
        return this.getResult(result);
    }

    public static getResult(result: CMDResult): IResult {
        const res: IResult = {
            code: result.exitCode,
            error: result.error,
            success: result.error ? false : true,
            data: result.data,
        };
        return res;
    }

}
