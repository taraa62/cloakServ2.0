import {BLogger} from "./BLogger";

export function ALogger() {
    return <TFunction extends Function>(target: TFunction) => {
        (target as any).logger = new BLogger();
        return target;
    };
}
