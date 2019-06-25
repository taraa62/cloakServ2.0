export interface IResult {
    error?: string | Error;
    code?: number;
    success?: boolean | string;
    msg?: string;
    data?: any;
}

export interface IFileInfo extends IResult {
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