import {StringUtils} from "./StringUtils";

export class ObjectUtils {
    /**
     * replace only for string!!! necessary
     * @param obj
     * @param from
     * @param to
     */
    public static replaceObjParam(obj: any, from: any, to: any): void {
        const check = (v:any) => {
            if (v.constructor.name === "String") {
                return ObjectUtils.replaceStringParam(v, from, to);
            } else if (v.constructor.name === "Array") {
                return checkArr(v);
            } else {
                return checkObj(v);
            }
        }
        const checkObj = (_ob:any) => {
            Object.keys(_ob).map(key => {
                _ob[key] = check(_ob[key]);
            })
            return _ob;
        }
        const checkArr = (_arr:any[]) => {
            _arr.map((v, v1) => {
                _arr[v1] = check(v)
            });
            return _arr
        }
        check(obj);

    }

    public static replaceStringParam(str:string, from: string, to: string): string {
        return StringUtils.replaceAll(str, from, to);

    }
}
