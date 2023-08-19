
import { Schema, Types, model } from "mongoose";
import mongoose from 'mongoose'

const brandSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true, },
    slug: { type: String, required: true, trim: true, lowercase: true, },
    image: { type: Object, required: true, },
    createdBy: { type: Types.ObjectId, ref:'User', required: true, },
    updatedBy: { type: Types.ObjectId, ref:'User', },
    isDeleted: { type: Boolean, default: false, },
}, {
    timestamps: true,
});


const brandModel = mongoose.models.Brand || model('Brand', brandSchema);

export default brandModel;