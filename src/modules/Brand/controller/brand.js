
import productModel from './../../../../DB/Models/Product.model.js';
import { asyncHandler } from "./../../../utils/errorHandling.js";
import brandModel from "./../../../../DB/Models/Brand.model.js";
import ApiFeatures from './../../../utils/apiFeatures.js';
import cloudinary from "./../../../utils/cloudinary.js";
import slugify from 'slugify'



export const getBrands = asyncHandler(async (req, res, next) => {
    const totalNumberOfData = await brandModel.countDocuments({ isDeleted: false });
    const apiFeature = new ApiFeatures(brandModel.find({ isDeleted: false }), req.query).paginate();
    const brandList = await apiFeature.mongooseQuery;
    apiFeature.metadata = {
        totalNumberOfData,
        limit: apiFeature.limit,
        numberOfPages: Math.floor(totalNumberOfData/apiFeature.limit) || 1,
        currentPage: apiFeature.page,
    }
    const restPages = Math.floor(totalNumberOfData/apiFeature.limit) - apiFeature.page;
    if(restPages>0) apiFeature.metadata.nextPage = restPages;

    return res.status(200).json({ message: "Done", metadata: apiFeature.metadata, data: brandList });
});

export const getBrand = asyncHandler(async (req, res, next) => {
    const { brandId } = req.params;
    const brand = await brandModel.findById(brandId);
    if(!brand || brand.isDeleted) {
        return next(new Error('In-valid brand Id', { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", brand});
});

export const createBrand = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (!req.file) {
        return next(new Error('File is required', { cause: 400 }));
    } 
    if(await brandModel.findOne({ name: name })) {
        return next(new Error("Duplicated brand name", { cause: 409 }));
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/Brand`});

    const brand = await brandModel.create({ 
        name,
        slug: slugify(name),
        image: {secure_url, public_id},
        createdBy: req.user._id,
    });
    if(!brand) {
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("Fail to create your brand", { cause: 400 }));
    }
    return res.status(201).json({ message: "Done", brand});
});

export const updateBrand = asyncHandler(async (req, res, next) => {
    const brandId = req.params.brandId;
    const brand = await brandModel.findById(brandId);
    if(!brand) {
        return next(new Error("In-valid brand Id", { cause: 404 }));
    }
    if(req.body.name){
        const name = req.body.name.toLowerCase();
        if (brand.name == name) {
            return next(new Error("Sorry cannot update brand with the same name", { cause: 400 }));
        }
        else if(await brandModel.findOne({ name: name })){
            return next(new Error("Duplicated brand name", { cause: 409 }));
        }
        else {
            brand.name = name; 
            brand.slug = slugify(req.body.name) 
        }
    }
    if(req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/Brand`});
        if(brand.image?.public_id){
            await cloudinary.uploader.destroy(brand.image.public_id);
        }
        brand.image = { secure_url, public_id };
    }

    if(req.body.isDeleted){
        const products = await productModel.find({ isDeleted: false, brandId });
        if(req.body.isDeleted=="true" && products?.length){
            return next(new Error("can not delete brand because some products has this brand id", { cause: 400 }));
        }
        brand.isDeleted = (req.body.isDeleted=="true")? true : false;
    }

    brand.updatedBy = req.user._id;
    await brand.save();
    return res.status(201).json({ message: "Done", brand});
});


