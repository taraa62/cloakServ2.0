import 'reflect-metadata';

type Controller = InstanceType<any>;


export interface IControllerConf {
    isUse: boolean;
    path: string;
}

export class ControllerConf implements IControllerConf {
    public isUse: boolean = true;
    public path: string;
}

const _conf = new ControllerConf();


export enum ClassKeys {
    BasePath = 'BASE_PATH',
    Middleware = 'MIDDLEWARE',
    Wrapper = 'WRAPPER',
    Children = 'CHILDREN',
    Options = 'OPTIONS',
}

export function Controller(conf: ControllerConf): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        conf = Object.assign(conf, _conf);
        if (!conf.isUse || !conf.path) return null;

        Reflect.defineMetadata(ClassKeys.BasePath, '/' + conf.path, target.prototype);
        return target;
    };
}
