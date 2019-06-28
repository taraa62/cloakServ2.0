export interface IResult {
    error?: string | Error;
    code?: number;
    success?: boolean | string;
    msg?: string;
    data?: any;

}

export class IResult implements IResult {
    public static get success(): IResult {
        return {success: true} as IResult;
    }

    public static succData(data: any): IResult {
        return {success: true, data: data} as IResult;
    }

    public static succMess(msg: any): IResult {
        return {success: true, msg: msg} as IResult;
    }

    public static succDataMess(data: any, msg: any): IResult {
        return {success: true, msg: msg, data: data} as IResult;
    }

    public static error(e: Error | any, code: number = undefined): IResult {
        return {error: e, code: code} as IResult;
    }

    public static errorMsg(e: Error | any, msg: any, code: number = undefined): IResult {
        return {error: e, msg: msg, code: code} as IResult;
    }

    public static resultToString(obj: IResult = null): string {
        if (!obj) return "";
        let res: string = "IResult: ";
        if (obj.error) {
            if (obj.error instanceof Error) {
                `[ERROR]: message: ${obj.error.message}  stack: \n ${obj.error.stack}`;
            } else {
                res += `[ERROR]: ${obj.error.toString()}`
            }
        }
        if (obj.code) res += "  [CODE]" + obj.code;
        if (obj.success) res += "  [SUCCESS]" + obj.success;
        if (obj.msg) res += "  [MSG]" + obj.msg.toString();
        if (obj.data) res += "  [DATA]" + obj.data.toString();
        return res;
    }
}

export interface IFileInfo
    extends IResult {
    size: number;
    mode: string;
    othersExecute: string;
    othersWrite: string;
    othersRead: string;
    groupExecute: string;
    groupWrite: string;
    groupRead: string;
    ownerExecute: string;
    ownerWrite: string;
    ownerRead: string;
    isFile: boolean;
    isDirectory: boolean;
    isBlockDevice: boolean;
}

//**** Nginx//

export interface IItemConfig {
    nameConfig: string;
    domain: string;
    isRewrite: boolean;
    protocolServer: string;
    nameServerConfD: string;
    pathToResource: string;
    sslSertificate?: string;
    sslSertificateKey?: string;
}

export interface IConfigNginx {
    name: string;
    config: string;
}
