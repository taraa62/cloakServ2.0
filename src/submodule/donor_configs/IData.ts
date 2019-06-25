export interface IDataWorker{
    pathConfigsFolder:string;
    db:IConfigDB
}

export interface IConfigDB {
    debug:boolean;
    url:string;
}




export interface IItemConfig {

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
    cleaner: ICleaner;
}

export interface ICleaner {
    isClearInvConfig: boolean,
    isClearOnlyHTML: boolean,
    isClearSubDomains: boolean,
    isClearAllNotLocalFiles: boolean,
    isClearResourceFolder: boolean
}
