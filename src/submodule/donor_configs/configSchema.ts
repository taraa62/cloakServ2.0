import mongoose from "mongoose";

export const configSchema = new mongoose.Schema({
    userCreate: String,
    userEdit: String,
    config: Object,
    cloneID: String,
    dateCreate: Date,
    timeStartEdit: Date
}, {
    timestamps: true
});
