import { fileUpload, fileValidation } from "./../../utils/cloudMulter.js";
import * as subcategoryController from './controller/subcategory.js'
import validation from "./../../middleware/validation.middleware.js";
import * as validators from "./subcategory.validation.js"
import auth from "./../../middleware/auth.middleware.js";
import { endPoint } from "./subcategory.endPoint.js";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.get(
    '/',
    // validation(validators.headers, true),
    // auth(endPoint.get),
    subcategoryController.getSubcategories,
);

router.get(
    '/:subcategoryId',
    // validation(validators.headers, true),
    // auth(endPoint.get),
    validation(validators.getSubcategory),
    subcategoryController.getSubcategory,
);

router.post(
    "/", 
    validation(validators.headers, true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.createSubcategory),
    subcategoryController.createSubcategory,
);

router.put(
    "/:subcategoryId", 
    validation(validators.headers, true),
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.updateSubcategory),
    subcategoryController.updateSubcategory,
);




export default router