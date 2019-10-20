import {ObjectId} from "mongodb";

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
    cleaner: ICleaner;
    regulations: IRegulations[];
    googleManagerID?: string;
    blackReplaceDomain: string[],
    blackReplaceSubDomain: string[]
}

export interface ICleaner {
    isClearInvConfig: boolean;
    isClearOnlyHTML: boolean;
    isClearSubDomains: boolean;
    isClearAllNotLocalFiles: boolean;
    isClearAllResource: boolean;
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
    outerHTML?: string;
    numCreate?: number
    selector?: string;
    type?: string;  //"child" or "parent" default = "child"
    attr?: any;
    innerHtml?: string;  //only innerHtml or innerText
    innerText?: string;
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
    firstElm?: boolean;
    lastElm?: boolean;
    delParentNum?: number | string;
    /*
        if(elemParam != undefined && attr != undefined)
        filter = (attr + startsWith|endsWith|indexOf|exactly) + (elemParam + startsWith|endsWith|indexOf|exactly)
     */
    id?: string;
    elemParam?: string    //outerHTML + startsWith|endsWith|indexOf|exactly
    attr?: any;           //attr + startsWith|endsWith|indexOf|exactly
    startsWith?: string;
    endsWith?: string;
    indexOf?: string;
    exactly?: string;
}

