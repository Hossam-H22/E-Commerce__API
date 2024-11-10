
import joi from 'joi';
import { generalFields } from '../../middleware/validation.middleware.js';


export const headers = joi.object({
    authorization: joi.string().required(),
}).required();


export const getCategory = joi.object({
    categoryId: generalFields.id,
}).required();


export const createCategory = joi.object({
    name: joi.string().min(2).max(50).required(),
    file: generalFields.file.required(),
}).required();


export const updateCategory = joi.object({
    categoryId: generalFields.id,
    name: joi.string().min(2).max(50),
    file: generalFields.file,
    isDeleted: joi.boolean(),
}).required();

export const updateCategoryGraph = joi.object({
    categoryId: generalFields.id,
    authorization: joi.string().required(),
    name: joi.string().min(2).max(50),
    isDeleted: joi.boolean(),
}).required();

