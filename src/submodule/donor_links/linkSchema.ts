import mongoose from "mongoose";
import {ILinkSchema} from "../interface/ISchema";

const _linkSchema = new mongoose.Schema<ILinkSchema>({
    domain: String,
    info: Object
}, {
    timestamps: true
});

export const linkSchema = _linkSchema;
