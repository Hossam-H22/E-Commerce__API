
import { generalFields } from './../../middleware/validation.middleware.js';
import joi from 'joi';



export const createReview = joi.object({
    productId: generalFields.id,
    comment: joi.string().min(2).max(150000),
    rating: joi.number().positive().min(1).max(5).required(),
}).required();


export const updateReview = joi.object({
    productId: generalFields.id,
    reviewId: generalFields.id,
    comment: joi.string().min(2).max(150000),
    rating: joi.number().positive().min(1).max(5),
}).required();

