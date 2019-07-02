export interface IServerConfig {
    type: string;
    port: number;
    x_powered_by: string;
    listDisableRoute: string[];
    corsWhitelist: string[];

}
export interface IAdminConfig {
    room: string;
    type: string;
    name: string;
}

export interface ILoggerConfig {
    path: string;
    config: any;
}

export interface IModuleConfig {
    isUse: boolean;
    name: string;
    path: string;
    config: any;
}

export interface IConfig {
    mode: string;
    server: IServerConfig;
    adminConnection: IAdminConfig,
    logger: ILoggerConfig;
    initModuleBeforeRunServe: IModuleConfig[];
    initModuleAfterRunServe: IModuleConfig[];
}

