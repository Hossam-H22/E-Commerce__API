
import subcategoryModel from "./../../../../DB/Models/Subcategory.model.js";
import categoryModel from "./../../../../DB/Models/Category.model.js";
import productModel from './../../../../DB/Models/Product.model.js';
import { asyncHandler } from "./../../../utils/errorHandling.js";
import ApiFeatures from './../../../utils/apiFeatures.js';
import cloudinary from "./../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from 'slugify'



export const getSubcategories = asyncHandler(async (req, res, next) => {
    const totalNumberOfData = await subcategoryModel.countDocuments({ isDeleted: false });
    req.query.details='categoryId';
    const apiFeature = new ApiFeatures(subcategoryModel.find({ isDeleted: false }), req.query).populate().select().paginate();
    const subcategoryList = await apiFeature.mongooseQuery;
    apiFeature.metadata = {
        totalNumberOfData,
        limit: apiFeature.limit,
        numberOfPages: Math.floor(totalNumberOfData/apiFeature.limit) || 1,
        currentPage: apiFeature.page,
    }
    const restPages = Math.floor(totalNumberOfData/apiFeature.limit) - apiFeature.page;
    if(restPages>0) apiFeature.metadata.nextPage = restPages;

    return res.status(200).json({ message: "Done", metadata: apiFeature.metadata, data: subcategoryList });
});

export const getSubcategory = asyncHandler(async (req, res, next) => {
    const { subcategoryId } = req.params;
    const subcategory = await subcategoryModel.findById(subcategoryId).populate([
        {
            path: 'categoryId'
        }
    ]);
    if(!subcategory || subcategory.isDeleted) {
        return next(new Error('In-valid subcategory Id', { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", subcategory});
});

export const createSubcategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const name = req.body.name.toLowerCase();

    if(!await categoryModel.findById(categoryId)) {
        return next(new Error("In-valid category Id", { cause: 400 }));
    }

    if (await subcategoryModel.findOne({ name })) {
        return next(new Error(`Duplicate subcategory name - ${name}`, { cause: 409 }));
    }

    const customId = nanoid();
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `${process.env.APP_NAME}/category/${categoryId}/${customId}`}
    );

    // add new photo data to database
    const subcategory = await subcategoryModel.create({ 
        name,
        slug: slugify(name),
        image: {secure_url, public_id},
        categoryId,
        customId,
        createdBy: req.user._id,
    });

    if(!subcategory) {
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("Fail to create your sub-category", { cause: 400 }));
    }

    return res.status(201).json({ message: "Done", subcategory});
});

export const updateSubcategory = asyncHandler(async (req, res, next) => {
    const { categoryId, subcategoryId } = req.params;
    const subcategory = await subcategoryModel.findOne({ _id:subcategoryId, categoryId });
    if(!subcategory) {
        return next(new Error("In-valid sub-category Id", { cause: 400 }));
    }
    
    if(req.body.name){
        const name = req.body.name.toLowerCase();
        if(subcategory.name == name) {
            return next(new Error(`Sorry cannot update subcategory with the same name`, { cause: 400 }));
        }
        else if (await subcategoryModel.findOne({ name })) {
            return next(new Error(`Duplicate subcategory name - ${name}`, { cause: 409 }));
        }
        else {
            subcategory.name = name;
            subcategory.slug = slugify(name) 
        }
    }

    if(req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path, 
            {folder: `${process.env.APP_NAME}/category/${categoryId}/${subcategory.customId}`}
        );
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        subcategory.image = { secure_url, public_id };
    }

    if(req.body.isDeleted){
        const products = await productModel.find({ isDeleted: false, subcategoryId });
        if(req.body.isDeleted=="true" && products?.length){
            return next(new Error("can not delete subcategory because some products has this subcategory id", { cause: 400 }));
        }
        subcategory.isDeleted = (req.body.isDeleted=="true")? true : false;
    }

    subcategory.updatedBy = req.user._id;
    await subcategory.save();
    return res.status(201).json({ message: "Done", subcategory});
});


