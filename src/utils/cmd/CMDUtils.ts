import {DefCheckerDocker} from "./DefCheckerDocker";
import {CMDResult} from "./CMDResult";


export class CMDUtils {

    private static commandLine: any = require("node-cmd/cmd.js");
    private static commandLine2: any = require("shelljs");

    private static dockerUtils: DefCheckerDocker;


    public static getDockerUtils(): DefCheckerDocker {
        if (!this.dockerUtils) this.dockerUtils = new DefCheckerDocker();
        return this.dockerUtils;
    }

    /**
     * Результат по закінченню комманди
     * @param command
     */
    public static async runCommandFullResult(command: string): Promise<CMDResult> {
        return new Promise<CMDResult>(async (result, rej) => {
            const com = CMDUtils.commandLine.run(command);
            // const com =(await require("node-cmd/cmd.js")).run(command);

            const res: CMDResult = new CMDResult();
            com.stdout.on('data', (data: any) => {
                res.data = data;
            });
            com.stderr.on('data', (error: Error) => {
                res.error = error;
            });
            com.on('exit', (code: number) => {
                res.exitCode = code;
                res.exitDesk = (code >0) ? "error" : "success";
                // console.log(res.data);
                result(res);
            });
        });
    }


    /**
     * Результат кодного разу після отримання результату
     * @param command
     * @param callback
     */
    public static runCommandChunk(command: string, callback: Function, logger: any = null): void {
        const com = CMDUtils.commandLine.run(command);
        com.stdout.on('data', (data: any) => {
            if (logger) logger.info('stdout: ', data);
            if (callback && callback instanceof Function) {
                // callbackData("stdout: " + data);
                callback(new CMDResult(null, data));
            }
        });
        com.stderr.on('data', (error: Error) => {
            // this.logger.error('stderr: ', error);
            if (callback && callback instanceof Function) {
                // callbackData("stderr: " + data);
                callback(new CMDResult(error));

            }
        });

        com.on('exit', (code: number) => {
            if (logger) logger.info('exit code: ' + code);
            if (callback && callback instanceof Function) {
                // callbackData("exit: " + code);
                callback(new CMDResult(null, null, code, (code === 1) ? "error" : "success"));
            }
        });
    }


}
