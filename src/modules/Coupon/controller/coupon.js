
import couponModel from "./../../../../DB/Models/Coupon.model.js";
import { asyncHandler } from "./../../../utils/errorHandling.js";
import cloudinary from "./../../../utils/cloudinary.js";



export const getCoupons = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.find({ isDeleted: false });
    return res.status(200).json({ message: "Done", coupon});
});

export const getCoupon = asyncHandler(async (req, res, next) => {
    const { couponId } = req.params;
    const coupon = await couponModel.findById(couponId);

    if(!coupon || coupon.isDeleted) {
        return next(new Error('In-valid coupon Id', { cause: 404 }))
    }

    return res.status(200).json({ message: "Done", coupon});
});

export const createCoupon = asyncHandler(async (req, res, next) => {
    if(await couponModel.findOne({ name: req.body.name })){
        return next(new Error("Duplicated coupon name", { cause: 409 }));
    }
    if (req.file) {
        // uploade new photo
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/coupon`});
        req.body.image = { secure_url, public_id };
    } 

    req.body.name = req.body.name.toLowerCase();
    req.body.createdBy = req.user._id;
    req.body.expireDate = new Date(req.body.expireDate);

    // add new photo data to database
    const coupon = await couponModel.create(req.body);
    if(!coupon) {
        if(req.body.image?.public_id) {
            await cloudinary.uploader.destroy(public_id);
        }
        return next(new Error("Fail to create your coupon", { cause: 400 }));
    }
    return res.status(201).json({ message: "Done", coupon});
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId);
    if(!coupon) {
        return next(new Error("In-valid coupon Id", { cause: 404 }));
    }
    if(req.body.name){
        const name = req.body.name.toLowerCase();
        if (coupon.name == name) {
            return next(new Error("Sorry cannot update coupon with the same name", { cause: 400 }));
        }
        else if(await couponModel.findOne({ name: name })){
            return next(new Error("Duplicated coupon name", { cause: 409 }));
        }
        else {
            coupon.name = name; 
        }
    }
    if(req.body.amount){
        coupon.amount = req.body.amount;
    }
    if(req.body.expireDate){
        coupon.expireDate = new Date(req.body.expireDate);
    }
    if(req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/coupon`});
        if(coupon.image?.public_id) {
            await cloudinary.uploader.destroy(coupon.image?.public_id);
        }
        coupon.image = { secure_url, public_id };
    }

    if(req.body.isDeleted){
        coupon.isDeleted = (req.body.isDeleted=="true")? true : false;
    }

    await coupon.save();
    return res.status(201).json({ message: "Done", coupon});
});


