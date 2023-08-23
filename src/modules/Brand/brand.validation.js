
import joi from 'joi';
import { generalFields } from './../../middleware/validation.middleware.js';


export const headers = joi.object({
    authorization: joi.string().required(),
}).required();

export const getBrand = joi.object({
    brandId: generalFields.id,
}).required();


export const createBrand = joi.object({
    name: joi.string().min(2).max(50).required(),
    file: generalFields.file,
}).required();



export const updateBrand = joi.object({
    brandId: generalFields.id,
    name: joi.string().min(2).max(50),
    file: generalFields.file,
    isDeleted: joi.boolean(),
}).required();