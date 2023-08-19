
import auth from './../../middleware/auth.middleware.js';
import * as productController from './controller/product.js'
import { endPoint } from './product.endPoint.js';
import { fileUpload, fileValidation } from './../../utils/cloudMulter.js';
import validation from './../../middleware/validation.middleware.js';
import * as validators from './product.validation.js'
import reviewRouter from './../Reviews/reviews.router.js'
import { Router } from "express";
const router = Router()

router.use('/:productId/review', reviewRouter);


router.get(
    '/',
    productController.getProductList,
);

router.get(
    '/:productId',
    productController.getProduct,
);

router.post(
    '/',
    auth(endPoint.create),
    fileUpload(fileValidation.image).fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]), 
    validation(validators.createProduct),
    productController.createProduct,
);

router.put(
    '/:productId',
    auth(endPoint.update),
    fileUpload(fileValidation.image).fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]), 
    validation(validators.updateProduct),
    productController.updateProduct,
);

router.patch(
    '/:productId/wishlist',
    auth(endPoint.wishlist), 
    validation(validators.wishlist),
    productController.addToWishlist,
);

router.patch(
    '/:productId/wishlist/remove',
    auth(endPoint.wishlist), 
    validation(validators.wishlist),
    productController.removeFromWishlist,
);




export default router;