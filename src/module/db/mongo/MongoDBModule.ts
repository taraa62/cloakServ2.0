import {BaseDB} from "../BaseDB";
import {CMDUtils} from "../../../utils/cmd/CMDUtils";
import {IResult} from "../../../utils/IUtils";
import mongoose, {Model} from "mongoose";
import {ObjectID} from "mongodb";


type Schema = mongoose.Schema;


export class MongoDBModule extends BaseDB {

    private isRunDB: boolean = false;

    public async init(): Promise<IResult> {
        await this.checkDocker();
        await this.connectToDB();
        return super.init();
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
        }).then(() => console.log('connect to DB mongo')).catch((er: Error) => {
            console.error(er);
        });
    }

    public async destroy(): Promise<IResult> {
        try {
            const res: any = await mongoose.disconnect((er: Error) => er);
            return <IResult>(res ? {error: res} : {success: true});
        } catch (e) {
            return {error: e};
        }
        return {error: "undefined error mongo module"};
    }


    public getModel(name: string, shema: Schema): Model<any> {
        return mongoose.model(name, shema);
    }

    public getObjectID(id: string): ObjectID {
        try {
            return ObjectID.createFromHexString(id);
        } catch (e) {
        }
        return null;
    }

    public async insert<T>(model: Model<any>, data: T): Promise<T> {
        const obj = new model(data);

        return await new Promise((resolve, reject) => {
            obj.save((err: Error, targ: any) => {
                if (err) reject(err);
                else resolve(targ._doc);
            })
        })
    }

    /**
     *
     * @param model
     * @param find
     * @param isSpreadOut - нужно ли нам перебрать ответ и выбрать только обьект с данными, по дефолту  - да
     * @return {Promise<any>}
     */
    async query<T>(model: Model<any>, find: T, isSpreadOut = true, opt = {}): Promise<IResult> {
        return await new Promise((resolve, reject) => {
            model.find(find, opt, (err, doc) => {
                if (err) reject({error: err});
                else {
                    if (isSpreadOut) {
                        const arr: any[] = [];
                        doc.map(v => arr.push(v._doc));
                        resolve({success: true, data: arr});
                    } else {
                        resolve({success: true, data: doc});
                    }
                }
            })
        })
    }

    public async update<T>(model: Model<any>, findNote: T, replaceTo: T, opt: T = null): Promise<IResult> {
        return await new Promise((resolve, reject) => {
            model.updateMany(findNote, replaceTo, opt, (err, result) => {
                (err) ? reject({error: err}) : resolve({success: true, data: result});
            })
        })
    }


    public async remove<T>(model: Model<any>,  findNote:T): Promise<IResult> {
        return await new Promise((resolve, reject) => {
            model.deleteMany(findNote, (err:Error) => {
                (err) ? reject({error: err}) : resolve({success: true});
            })
        })
    }
   public async clearDB(model: Model<any>): Promise<IResult> {
        return await new Promise((resolve, reject) => {
            model.deleteMany({}, (err) => {
                (err) ? reject({error: err}) : resolve({success: true});
            })
        })
    }



}
