
import productModel from "./../../../../DB/Models/Product.model.js";
import reviewModel from "./../../../../DB/Models/Review.model.js";
import { asyncHandler } from "./../../../utils/errorHandling.js";
import orderModel from './../../../../DB/Models/Order.model.js';



export const createReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { comment, rating } = req.body;

    const order = await orderModel.findOne({
        userId: req.user._id,
        status: 'delivered',
        "products.productId": productId,
    });
    if(!order) {
        return next(new Error(`Can not review product before receive it`, { cause: 400 }));
    }
    
    const checkReview = await reviewModel.findOne({ createdBy: req.user._id, productId, orderId: order._id});
    if(checkReview) {
        return next(new Error(`Already reviewed by you`, { cause: 400 }));
    }

    const review = await reviewModel.create({ 
        comment, 
        rating, 
        createdBy: req.user._id,
        orderId: order._id,
        productId
    });

    const product = await productModel.findOne({ _id: productId });
    product.numOfRating = product.numOfRating+1;
    product.totalRating = product.totalRating+ rating;
    product.avgRating = product.totalRating / product.numOfRating;
    await product.save();

    return res.status(201).json({ message: "Done", review });
});


export const updateReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.params;

    const review = await reviewModel.findByIdAndUpdate({ _id: reviewId, productId }, req.body);
    if(!review){
        return next(new Error(`In-valid review id`, { cause: 404 }));
    }

    const product = await productModel.findOne({ _id: productId });
    product.totalRating = product.totalRating - review.rating;
    product.totalRating = product.totalRating + req.body.rating;
    product.avgRating = product.totalRating / product.numOfRating;

    await product.save();
    return res.status(200).json({ message: "Done" });
});