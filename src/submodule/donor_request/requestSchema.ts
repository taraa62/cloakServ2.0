import * as mongoose from "mongoose";
import {IRequestSchema} from "../interface/ISchema";


const _requestSchema = new mongoose.Schema<IRequestSchema>({
    domain: String,
    info: Object
}, {
    timestamps: true
});

export const requestSchema = _requestSchema;
