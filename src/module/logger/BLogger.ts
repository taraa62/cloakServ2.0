export class BLogger {

    private localLogger: any;
    private remoteLogger: any;

    constructor(localLogger: any = null, remoteLogger: any = null) {
        this.localLogger = localLogger;
        this.remoteLogger = remoteLogger;
    }

    public debug(mess: any, obj?: any): void {
        mess = this.getMessage(mess, obj);
        if (mess.indexOf("UnhandledPromiseRejectionWarning") > -1)
            this.error(mess, obj);
        else this.print(mess, "debug");
    }

    public info(mess: any, obj?: any): void {
        mess = this.getMessage(mess, obj);
        if (mess.indexOf("UnhandledPromiseRejectionWarning") > -1)
            this.error(mess, obj);
        else this.print(mess, "info");
    }

    public error(mess: any, error?: any): void {
        mess = this.getMessage(mess, error);
        this.print(mess, "error");
    }

    private print(mess: any, type: string = "error" || "info" || "debug"): void {
        if (this.localLogger && this.localLogger[type]) this.localLogger[type](mess);
        else (console as any)[type](mess);
        if (this.remoteLogger) {
            this.remoteLogger[type](mess);
        }
    }

    private getMessage(mess: any, value: any): string {
        const getMessError = (message: any) => {
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
            }
            return message;
        };

        mess = getMessError(mess);
        if (mess && mess.constructor.name !== "String") {
            mess = JSON.stringify(mess);
        }
        value = getMessError(value);
        if (value) {
            if (typeof value !== "string") mess += "\n " + JSON.stringify(value);
            else mess += "\n" + value;
        }

        return mess;
    }


}
