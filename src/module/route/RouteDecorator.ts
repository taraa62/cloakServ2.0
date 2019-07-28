import 'reflect-metadata';
import {AdminRouteController} from "../admin/AdminRouteController";

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

export function EndPoint(isUse: boolean, auth: boolean, action: string): MethodDecorator {

    // tslint:disable-next-line:ban-types
    return (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) => {


        if (!target.__routeMethod) target.__routeMethod = new Map<string, RouteEndPoint>();
        if (isUse && target[propertyName] && target[propertyName] instanceof Function) {
            const ed: RouteEndPoint = new RouteEndPoint(auth, action, target, target[propertyName]);
            target.__routeMethod.set(action, ed);
        }
        return target;
    };
}

export class RouteEndPoint {

    constructor(public auth: boolean, public action: string, public target: any, public callback: Function) {

    }
}
