import {LoggerModule} from "../module/logger/LoggerModule";
import {BModule} from "../module/BModule";
import {IModuleConfig} from "./IConfig";
import {EModules} from "./config";

export interface IServer {

    getLoggerModule(): LoggerModule;

    getModule(eModule: EModules): BModule;

    getConfigModule(name: string): IModuleConfig;
}
