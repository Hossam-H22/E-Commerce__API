import {validation} from './../../middleware/validation.middleware.js';
import {auth} from './../../middleware/auth.middleware.js';
import * as orderController from './controller/order.js'
import * as validators from './order.validation.js'
import { endPoint } from './order.endPoint.js';
import { Router } from 'express';
import express from 'express'
const router = Router()



router.get(
    '/',
    auth(endPoint.get),
    orderController.getOrders,
);

router.post(
    '/',
    auth(endPoint.create),
    validation(validators.createOrder),
    orderController.createOrder
);

router.patch(
    '/:orderId',
    auth(endPoint.cancel),
    validation(validators.cancelOrder),
    orderController.cancelOrder
);

router.patch(
    '/:orderId/update',
    auth(endPoint.adimnUpdateOrder),
    validation(validators.updateOrderStatusByAdmin),
    orderController.updateOrderStatusByAdmin
);

router.post(
    '/webhook', 
    express.raw({ type: 'application/json' }), 
    orderController.webhook
);




export default router