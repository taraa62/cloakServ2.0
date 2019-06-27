import {IResult} from "./IUtils";
import {FileManager} from "./FileManager";

export interface IClasses {
    init(): Promise<any>

    endInit(): Promise<any>
}

export class ClassUtils {

    public static async initClasses(classList: any[] | Map<any, any>, state: "init" | "endInit" = "init"): Promise<IResult> {
        let iRes: IResult = await Promise.all(this.initClass(<IClasses[]>classList, state)).then(v => {
            for (let s of v) {
                if (s.error) return s;
            }
            return IResult.success
        }).catch(e => {
            return IResult.error(e)
        });
        return iRes;
    }

    private static initClass(classList: IClasses[], state: string): Promise<any>[] {
        const list: Promise<any>[] = [];

        classList.forEach(v => {
            list.push((state === "init") ? v.init() : v.endInit());
        })
        return list;
    }


    static async createNewClass<T>(pathTo: string, pathRarent: string = null, ...ags: any[]): Promise<T> {
        try {
            const path = FileManager.getSimplePath(pathTo, pathRarent);
            const _l = await require(path);
            const mod: any = Object.values(_l)[0];
            const res: T = new mod(...ags);
            return res;
        } catch (e) {
            console.error(e);
        }
        return null;
    }

}
