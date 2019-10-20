import * as mongoose from "mongoose";
import {ILinkSchema} from "../interface/ISchema";

const _linkSchema = new mongoose.Schema({
    domain: String,
    info: Object
}, {
    timestamps: true
});

export const linkSchema = _linkSchema;
