import {LoggerModule} from "../module/logger/LoggerModule";
import {BModule} from "../module/BModule";
import {IModuleConfig} from "./IConfig";

export interface IServer {

    getLoggerModule(): LoggerModule;

    getModule(name: string): BModule;

    getConfigModule(name: string): IModuleConfig;
}
