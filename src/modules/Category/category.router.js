import { Router } from "express";
import { fileUpload, fileValidation } from "./../../utils/cloudMulter.js";
import * as categoryController from './controller/category.js'
import validation from "./../../middleware/validation.middleware.js";
import * as validators from "./category.validation.js"
import subcategoryRouter from "./../Subcategory/subcategory.router.js"
import auth from "./../../middleware/auth.middleware.js";
import { endPoint } from "./category.endPoint.js";

const router = Router()

router.use("/:categoryId/subcategory", subcategoryRouter);

router.get(
    '/',
    // validation(validators.headers, true),
    // auth(endPoint.get),
    categoryController.getCategories,
); 

router.get(
    '/:categoryId',
    // validation(validators.headers, true),
    // auth(endPoint.get),
    validation(validators.getCategory),
    categoryController.getCategory,
); 


router.post(
    "/", 
    // validation(validators.headers, true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.createCategory),
    categoryController.createCategory,
);

router.put(
    "/:categoryId", 
    // validation(validators.headers, true),
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.updateCategory),
    categoryController.updateCategory,
);




export default router