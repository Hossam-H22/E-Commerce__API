
import auth from './../../middleware/auth.middleware.js';
import * as reviewController from './controller/reviews.js'
import { endPoint } from './reviews.endPoint.js';
import validation from './../../middleware/validation.middleware.js';
import * as validators from './reviews.validation.js'
import { Router } from "express";
const router = Router({ mergeParams: true });



// router.get(
//     '/',
//     reviewController.getreviews,
// );

// router.get(
//     '/:reviewId',
//     reviewController.getreview,
// );

router.post(
    '/',
    auth(endPoint.create), 
    validation(validators.createReview),
    reviewController.createReview,
);

router.put(
    '/:reviewId',
    auth(endPoint.update), 
    validation(validators.updateReview),
    reviewController.updateReview,
);






export default router;