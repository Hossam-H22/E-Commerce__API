
import { Schema, Types, model } from "mongoose";
import mongoose from 'mongoose'

const couponSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true, },
    image: { type: Object, },
    amount: { type: Number, default: 1 },
    expireDate: { type: Date, required: true, },
    createdBy: { type: Types.ObjectId, ref:'User', required: true, },
    usedBy: [{ type: Types.ObjectId, ref:'User', }], 
    isDeleted: { type: Boolean, default: false, },
}, {
    timestamps: true,
});


const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema);

export default couponModel;