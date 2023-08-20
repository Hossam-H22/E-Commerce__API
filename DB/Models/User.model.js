
import { Schema, Types, model } from "mongoose";
import mongoose from 'mongoose'

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, "minimum length 2 char"],
        max: [20, "maximum length 20 char"],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique value'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female'],
    },
    image: Object,
    age: Number,
    phone: String,
    address: String,
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: 'offline',
        enum: ['offline', 'online', 'blocked'],
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin', 'Seller'],
    },
    DOB: String,
    forgetCode: {
        type: Number,
        default: null,
    },
    changePasswordTime: {
        type: Date,
    },
    wishlist: {
        type: [{ type: Types.ObjectId, ref: 'Product' }],
    },
    provider: {
        type: String,
        default: 'SYSTEM',
        enum: ['SYSTEM', 'GOOGLE']
    }
}, {
    timestamps: true,
});


const userModel = mongoose.models.User || model('User', userSchema);

export default userModel;