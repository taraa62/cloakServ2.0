import {CMDUtils} from "./CMDUtils";
import {IResult} from "../IUtils";

export class DefCheckerDocker {

    private isDocker: boolean = false;
    private isCheckRunDocker: boolean = false;

    constructor() {

    }

    private async checkRunnableDocker(): Promise<boolean> {
        if (this.isCheckRunDocker) return false;
        if (this.isDocker) return true;

        const iRes: IResult = await CMDUtils.runCommandFullResult("docker -v");
        // const iRes: IResult = await CMDUtils.runCommandFullResult("docker ps -a");
        if (iRes.success && iRes.data.indexOf("Docker version") > -1) {
            this.isDocker = true;
            return true;
        }
        return false;
    }

    public async checkRunContainer(name: string): Promise<IResult> {
        if (await this.checkRunnableDocker()) return {error: "docker isn't run"};

        const iRes: IResult = await CMDUtils.runCommandFullResult(`docker inspect --format '{{json .State}}' ${name}`);
        if (iRes.success) {
            try {
                const json = JSON.parse(iRes.data);
                return (json.Status.indexOf("exit") > 1) ? {error: "docker container is exit"} : {success: true};
            } catch (e) {
                return {error: e};
            }
        }
        return iRes;
    }

    public async startRunContainer(name: string, isCheckStart: boolean = false): Promise<IResult> {
        if (await this.checkRunnableDocker()) return {error: "docker isn't run"};

        const iRes: IResult = await CMDUtils.runCommandFullResult(`docker start ${name}`);
        if (!isCheckStart || iRes.error) return iRes;
        else return await this.checkRunContainer(name);
    }
}
