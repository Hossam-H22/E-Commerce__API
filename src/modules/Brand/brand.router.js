import { Router } from "express";
import { fileUpload, fileValidation } from "./../../utils/cloudMulter.js";
import * as brandController from './controller/brand.js'
import validation from "./../../middleware/validation.middleware.js";
import * as validators from "./brand.validation.js"
import { endPoint } from "./brand.endPoint.js";
import auth from "./../../middleware/auth.middleware.js";

const router = Router()


router.get(
    '/',
    // auth(endPoint.get),
    brandController.getBrands,
); 

router.get(
    '/:brandId',
    // auth(endPoint.get),
    validation(validators.getBrand),
    brandController.getBrand,
); 


router.post(
    "/", 
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.createBrand),
    brandController.createBrand,
);

router.put(
    "/:brandId", 
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.updateBrand),
    brandController.updateBrand,
);




export default router