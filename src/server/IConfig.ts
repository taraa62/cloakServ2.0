export interface IServerConfig {
    port: number;
    x_powered_by: string;
    listDisableRoute: string[];
    corsWhitelist: string[];

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
    nameApp: string;
    version: string;
    mode: string;
    path: string;
    room: string;
    type: string;
    name: string;
    contentTypes: any;
    server: IServerConfig;
    logger: ILoggerConfig;
    initModuleBeforeRunServe: IModuleConfig[];
    initModuleAfterRunServe: IModuleConfig[];
}
