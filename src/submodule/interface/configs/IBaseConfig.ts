export interface IBaseConfig {


    canDoRequestToDonor: boolean;
    basePathToResourceFolder: string;

    maskAcceptContentType: string[];
    maskEditContentType: string[];
    maskTextReplaceBeforeSafe: string[];
    maskAutoRedirectResponse: string[];
    blackWordStarts: string[];
    listBlackChatLinks: string[];
    listBlackScripts: string[];
    listBlackNoScript: string[];
    listMeta: string[];
    maxUseParamForSaveFile: number;
    blackParamForSave: string[];
    prioritySaveParam: string[];
    proxy: IProxyConf;
    defListInvAutoTime: string[];
    defInvTime: IDefInvalidationTime;
    fraudfilter: IFraudfilter;
    topGoogleManager: string;
    bottomGoogleManager: string;
    updated_by: string;
    updated_at: string;
}

export interface IProxyConf {
    proxyList: Array<any>;
    proxyName: string;
}

export interface IDefInvalidationTime {
    def: string;
}

export interface IFraudfilter {
    nameCookies: string;
    authExpirationTime: string;
}
