import { Router } from "express";
import * as cartController from './controller/cart.js'
import auth from "./../../middleware/auth.middleware.js";
import { endPoint } from "./cart.endPoint.js";
import validation from "./../../middleware/validation.middleware.js";
import * as validators from './cart.validation.js'
const router = Router()




router.get(
    '/',
    auth(endPoint.get),
    cartController.getCart,
); 

router.post(
    '/',
    auth(endPoint.create),
    validation(validators.createCart),
    cartController.createCart
);

router.patch(
    '/remove',
    auth(endPoint.delete),
    validation(validators.deleteItems),
    cartController.deleteItems
);

router.patch(
    '/clear',
    auth(endPoint.delete),
    // validation(validators.deleteItems),
    cartController.clearCart
);




export default router