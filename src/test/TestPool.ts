import {WorkersModule} from "../module/workers/WorkersModule";
import {BModule} from "../module/BModule";
import {IResult} from "../utils/IUtils";
import * as util from "util";

export class TestPool {

    private static pause = util.promisify(setTimeout);

    static async testSizePool() {
        for (let a = 0; a < 5; a++) {
            setTimeout(async (id: number) => {

                const iRes: IResult = await (<WorkersModule>TestPool.getModule("workers")).setTaskPool("donorWorker", {id: a});

                console.log(`${id} = ${IResult.resultToString(iRes)}`)

            }, 1000, a);
        }

       await TestPool.pause(3000);

        for (let a = 0; a < 105; a++) {
            setTimeout(async (id: number) => {

                const iRes: IResult = await (<WorkersModule>TestPool.getModule("workers")).setTaskPool("donorWorker", {id: a});

                console.log(`${id} = ${IResult.resultToString(iRes)}`)

            }, 1000, a);
        }

    }

    private static getModule(name: string): BModule {
        return (process as any).constant.app.getModule(name);
    }
}
