export interface IResult {
    error: string | Error;
    code: number;
    success: boolean | string;
    data: any;
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
