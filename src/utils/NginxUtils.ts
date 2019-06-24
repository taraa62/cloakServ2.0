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

    public static async stopNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.STOP_NGINX);
        const res: IResult = {
            code: result.exitCode,
            error: result.error,
            success: result.error ? false : true,
            data: result.data
        };
        return res;
    }

    public static async startNginx(): Promise<IResult> {
        const result: CMDResult = await CMDUtils.runCommandFullResult(CDMCommand.START_NGINX);
        const res: IResult = {
            code: result.exitCode,
            error: result.error,
            success: result.error ? false : true,
            data: result.data
        };
        return res;
    }


}
