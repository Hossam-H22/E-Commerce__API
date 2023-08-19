
import joi from 'joi';
import { generalFields } from './../../middleware/validation.middleware.js';



export const headers = joi.object({
    authorization: joi.string().required(),
}).required();

export const getCoupon = joi.object({
    couponId: generalFields.id,
}).required();


export const createCoupon = joi.object({
    name: joi.string().min(2).max(50).required(),
    amount: joi.number().positive().min(0).max(100).required(),
    expireDate: joi.date().greater(Date.now()).required(),
    file: generalFields.file,
}).required();


export const updateCoupon = joi.object({
    couponId: generalFields.id,
    name: joi.string().min(2).max(50),
    amount: joi.number().positive().min(0).max(100),
    expireDate: joi.date().greater(Date.now()),
    file: generalFields.file,
}).required();