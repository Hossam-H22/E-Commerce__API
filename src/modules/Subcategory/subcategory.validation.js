
import { generalFields } from './../../middleware/validation.middleware.js';
import joi from 'joi';

export const headers = joi.object({
    authorization: joi.string().required(),
}).required();

export const getSubcategory = joi.object({
    subcategoryId: generalFields.id,
    categoryId: generalFields.id,
}).required();


export const createSubcategory = joi.object({
    categoryId: generalFields.id,
    name: joi.string().min(2).max(50).required(),
    file: generalFields.file.required(),
}).required();


export const updateSubcategory = joi.object({
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    name: joi.string().min(2).max(50),
    file: generalFields.file,
}).required();