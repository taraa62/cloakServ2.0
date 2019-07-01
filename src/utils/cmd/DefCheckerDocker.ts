import {CMDUtils} from "./CMDUtils";
import {IResult} from "../IUtils";
import {CMDResult} from "./CMDResult";

export class DefCheckerDocker {

    private isDocker: boolean = false;
    private isCheckRunDocker: boolean = false;

    constructor() {

    }

    private async checkRunnableDocker(): Promise<boolean> {
        if (this.isDocker) return true;

        const iRes: CMDResult = await CMDUtils.runCommandFullResult("docker info");
        // const iRes: IResult = await CMDUtils.runCommandFullResult("nautilus");

        if (!iRes.error) {
            this.isDocker = true;
            return true;
        }
        return false;
    }

    public async checkRunContainer(name: string): Promise<IResult> {
        if (! await this.checkRunnableDocker()) return {error: "docker isn't run"};

        const iRes: CMDResult = await CMDUtils.runCommandFullResult(`docker inspect --format '{{json .State}}' ${name}`);
        if (iRes.exitCode == 0 && iRes.data) {
            try {
                const json = JSON.parse(iRes.data);
                return (json.Status.indexOf("exit") > 1) ? IResult.error("docker container is exit") : IResult.success;
            } catch (e) {
                return IResult.error(e);
            }
        }
        return IResult.error(iRes.error, iRes.exitCode);
    }

    public async startRunContainer(name: string, isCheckStart: boolean = false): Promise<IResult> {
        if (!await this.checkRunnableDocker()) return {error: "docker isn't run"};

        const iRes: IResult = await CMDUtils.runCommandFullResult(`docker start ${name}`);
        if (!isCheckStart || iRes.error) return iRes;
        else return await this.checkRunContainer(name);
    }
}
