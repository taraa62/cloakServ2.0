import {ObjectId} from "bson";

export interface IItemConfig {
    _id: string | ObjectId;

    isOnlyOne?: boolean;
    isClearDB?: boolean;
    isCheckFile?: boolean;

    isUse: boolean;
    updatedBy: string;
    updatedAt: string;
    data: IConfig;
}

export interface IConfig {
    donorOrigin: string;
    ourHost: string;
    nameResourceFolder: string;
    canDoRequestToDonor: string;
    blackParamForSave?: string[];
    prioritySaveParam?: string[];
    cleaner: ICleaner;
    regulations: IRegulations[];
    googleManagerID?: string;
}

export interface ICleaner {
    isClearInvConfig: boolean;
    isClearOnlyHTML: boolean;
    isClearSubDomains: boolean;
    isClearAllNotLocalFiles: boolean;
    isClearResourceFolder: boolean;
}

export interface IRegulations {
    pages: Array<string>;
    regular: IRegular[];
}

export interface IRegular {
    isUse?: boolean;
    process: string;
    event: string;
    reg?: IReg;
    append?: IAppend;
    where: IWhere;
}

export interface IAppend {
    text?: string;
}

export interface IReg {
    selector?: string;
    regText?: string;
    replaceTo?: string;
    isReplAll?: string;
    xpath?: string;
    replaceAttr?: string;
    innerHTML?: string;
    outerHTML?: string;
    attr?: any;
}

export interface IWhere {
    queryAll?: string;
    startsWith?: string;
    endsWith?: string;
    indexOf?: string;
    exactly?: string;
    param?: string;
    selector?: string;
    beforeElm?: string;
    attr?: any;
}

