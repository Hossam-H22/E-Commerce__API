
import joi from 'joi';
import { generalFields } from './../../middleware/validation.middleware.js';



export const createCart = joi.object({
    productId: generalFields.id,
    quantity: joi.number().positive().integer().min(0).required(),
}).required();


export const deleteItems = joi.object({
    productIds: joi.alternatives().try(
        joi.array().items(generalFields.id).min(1).required(),
        generalFields.id
    ).required(),
}).required();