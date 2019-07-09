import {IResult} from "../../utils/IUtils";
import {ClassKeys} from "../route/RouteDecorator";

export class BLogger {

    private localLogger: any;
    private remoteLogger: any;
    private isShowCallClass: boolean = true;
    private isShowCallClassOnlyError: boolean = true;
    private ansiParser = require("ansi-parser");

    constructor(localLogger: any = null, remoteLogger: any = null) {
        this.localLogger = localLogger;
        this.remoteLogger = remoteLogger;
    }

    public debug(mess: any, obj?: any): void {
        mess = this.getMessage(mess, obj, this.getLogCallClasses("debug"));
        if (mess.indexOf("UnhandledPromiseRejectionWarning") > -1)
            this.error(mess, obj);
        else this.print(mess, "debug");
    }

    public info(mess: any, obj?: any): void {
        mess = this.getMessage(mess, obj, this.getLogCallClasses("info"));
        if (mess.indexOf("UnhandledPromiseRejectionWarning") > -1)
            this.error(mess, obj);
        else this.print(mess, "info");
    }

    public error(mess: any, error?: any): void {
        mess = this.getMessage(mess, error, this.getLogCallClasses("error"));
        this.print(mess, "error");
    }

    private print(mess: any, type: string = "error" || "info" || "debug"): void {
        // mess = this.ansiParser.removeAnsi(mess);   //TODO може потім пофіксять цей баг !!!!
        if (this.localLogger && this.localLogger[type]) this.localLogger[type](mess);
        else (<any>console)[type](mess);
        if (this.remoteLogger) {
            this.remoteLogger[type](mess);
        }
    }


    private getLogCallClasses(type: string): string {

        if (!this.isShowCallClass) return "";
        let isCreate = true;
        if (this.isShowCallClassOnlyError && type !== "error") isCreate = false;
        if (!isCreate) return "";

        const blackList = ["task_queues", "process.emit", "emitListeningNT", "events.js"]
        // const blackList = [""]
        const err = {};
        Error.captureStackTrace(err);
        const lines: any[] = (err as Error).stack.split("\n");
        let arr = [];
        for (let t: number = 1; t < lines.length; t++) {
            const st: string = lines[t];
            if (!blackList.find(v => st.indexOf(v) > -1)) {
                if (st.indexOf("anonymous") < 0) {
                    const aa = st.substring(st.lastIndexOf("/") + 1, st.length).split(":");

                    if (!arr.length) arr.push([aa[0], [aa[1]]]);
                    else if (arr[arr.length - 1][0] == aa[0]) {
                        const s = arr[arr.length - 1];
                        (<any>s[1]).push(aa[1])
                    } else {
                        arr.push([aa[0], [aa[1]]]);
                    }
                }
            }
        }

        if (arr.length > 0) {
            let mes = "";
            arr = arr.reverse()
            for (let vv = 0; vv < arr.length - 1; vv++) {
                const v = arr[vv];
                if (mes) mes += "::"
                mes += `[${v[0]}:${(v[1] as any).join(":")}]`
            }
            return mes + "    ";

        }
        return "[anonymous:]       ";

    }

    private getMessage(mess: any, value: any, stack: string = ""): string {
        const getMessError = (message: any) => {
            if (!message) return message;

            if (message instanceof Error) {
                const m: any = message;
                if (m.fileName) message = `${m.fileName} => message: ${message.message}:${m.lineNumber}  stack: \n ${message.stack}`;
                else {
                    const arr = message.stack.split("\n");
                    if (arr.length > 1) {
                        const nameFile = arr[1].substring(arr[1].lastIndexOf("/") + 1, arr[1].length - 1);
                        message = `${nameFile} => message: ${message.message}  stack: \n ${message.stack}`;
                    }
                }
            } else if (message.constructor.name === "String") {
                message = message.trim();
            } else if (message.error || message.success || message.data) {
                message = IResult.resultToString(message);
            }
            return stack + message;
        };

        mess = getMessError(mess);
        if (mess && mess.constructor.name !== "String") {
            mess = JSON.stringify(mess);
        }
        value = getMessError(value);
        if (value && value !== "undefined") {
            if (typeof value !== "string") mess += "\n " + JSON.stringify(value);
            else mess += "\n" + value;
        }

        return mess;

    }


}

