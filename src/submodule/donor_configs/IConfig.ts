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
    regulations: IRegulations[]
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
    process: string;
    event: string;
    reg?: IReg;
    where: IWhere;
}

export interface IReg {
    innerHTML: string;
}

export interface IWhere {
    queryAll?: string;
    startsWith?: string;
    endsWith?: string;
    indexOf?: string;
    exactly?: string;
}
