
import { Router } from "express";
import { fileUpload, fileValidation } from "./../../utils/cloudMulter.js";
import * as couponController from './controller/coupon.js'
import {validation} from "./../../middleware/validation.middleware.js";
import * as validators from "./coupon.validation.js"
import { endPoint } from "./coupon.endPoint.js";
import {auth} from "./../../middleware/auth.middleware.js";

const router = Router()



router.get(
    '/',
    auth(endPoint.get),
    couponController.getCoupons,
); 

router.get(
    '/:couponId',
    auth(endPoint.get),
    validation(validators.getCoupon),
    couponController.getCoupon,
); 


router.post(
    "/", 
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.createCoupon),
    couponController.createCoupon,
);

router.put(
    "/:couponId", 
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.updateCoupon),
    couponController.updateCoupon,
);




export default router
