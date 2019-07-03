import mongoose from "mongoose";
import { IItemConfig} from "./IConfig";
import {ObjectId} from "bson";

const _configSchema = new mongoose.Schema<IItemConfig>({

    isOnlyOne: Boolean,
    isClearDB: Boolean,
    isCheckFile: Boolean,

    isUse: Boolean,
    updatedBy: Boolean,
    updatedAt: Boolean,
    data: Object,
}, {
    timestamps: true
});

export const configSchema = _configSchema;
