
import joi from 'joi';
import { generalFields } from './../../middleware/validation.middleware.js';


export const createOrder = joi.object({
    note: joi.string(),
    address: joi.string().min(5).required(),
    couponName: joi.string(),
    paymentType: joi.string().valid('cash', 'card'),
    phone: joi.alternatives().try(
        joi.array().items(
            joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required()
        ).min(1).max(3),
        joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
    ).required(),
    products: joi.array().items(
        joi.object({
            productId: generalFields.id,
            quantity: joi.number().positive().integer().min(1).required(),
        })
    ).min(1),
    success_url: joi.string().min(0),
    cancel_url: joi.string().min(0), 
}).required();


export const cancelOrder = joi.object({
    orderId: generalFields.id,
    reason: joi.string().min(5).required(),
}).required();

export const updateOrderStatusByAdmin = joi.object({
    orderId: generalFields.id,
    status: joi.string().valid('rejected', 'placed', 'onWay', 'delivered').required(),
}).required();

export const getOrderGraph = joi.object({
    authorization: joi.string().required(),
}).required();