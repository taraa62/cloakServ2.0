import {BaseDB} from "../BaseDB";
import {CMDUtils} from "../../../utils/cmd/CMDUtils";
import {IResult} from "../../../utils/IUtils";
import {ObjectID} from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;


export class MongoDBModule extends BaseDB {

    private isRunDB: boolean = false;

    async init(wait: Function): Promise<any> {
        await this.checkDocker();
        await this.connectToDB();

        super.init(wait);
    }

    private async checkDocker(): Promise<any> {
        if (this.subConfig.isCheckDockerContainer) {
            const iRes: IResult = await CMDUtils.getDockerUtils().startRunContainer(this.subConfig.dockContainerName, true);

            if (iRes.error) {
                this.isRunDB = false;
                this.logger.error(iRes.error);
            } else this.isRunDB = true;
        }
    }

    private async connectToDB(): Promise<any> {
        if (!this.isRunDB) return;

        mongoose.Promise = Promise;
        mongoose.set('debug', this.subConfig.debug);
        await mongoose.connect(this.subConfig.url, {
            useCreateIndex: true,
            useNewUrlParser: true
        }).then(v => console.log('connect to DB mongo')).catch(er => {
            console.error(er);
        });
    }

    public async destroy(): Promise<IResult> {
        try {
            const res: any = await mongoose.disconnect(er => er);
            return <IResult>(res ? {error: res} : {success: true});
        } catch (e) {
            return {error: e};
        }
        return {error: "undefined error mongo module"};
    }
}
