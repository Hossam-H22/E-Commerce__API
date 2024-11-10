
import categoryModel from "./../../../../DB/Models/Category.model.js";
import productModel from './../../../../DB/Models/Product.model.js';
import { asyncHandler } from "./../../../utils/errorHandling.js";
import cloudinary from "./../../../utils/cloudinary.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import slugify from 'slugify'
import subcategoryModel from "../../../../DB/Models/Subcategory.model.js";



export const getCategories = asyncHandler(async (req, res, next) => {
    const totalNumberOfData = await categoryModel.countDocuments({ isDeleted: false });
    // req.query.details='subcategoryId';
    const apiFeature = new ApiFeatures(categoryModel.find({ isDeleted: false }), req.query).populate().select().paginate();
    const categoriesList = await apiFeature.mongooseQuery;
    apiFeature.metadata = {
        totalNumberOfData,
        limit: apiFeature.limit,
        numberOfPages: Math.floor(totalNumberOfData/apiFeature.limit) || 1,
        currentPage: apiFeature.page,
    }
    const restPages = Math.floor(totalNumberOfData/apiFeature.limit) - apiFeature.page;
    if(restPages>0) apiFeature.metadata.nextPage = restPages;

    return res.status(200).json({ message: "Done", metadata: apiFeature.metadata, data: categoriesList });
});

export const getCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findById(categoryId).populate([
        {
            path: 'subcategoryId',
        }
    ]);

    if(!category || category.isDeleted) {
        return next(new Error('In-valid category Id', { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", category });
});

export const createCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return next(new Error(`Duplicate category name - ${name}`, { cause: 409 }));
    }

    // uploade new photo
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/Category` });

    // add new photo data to database
    const category = await categoryModel.create({
        name,
        slug: slugify(name),
        image: { secure_url, public_id },
        createdBy: req.user._id,
    });

    if (!category) {
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("Fail to create your category", { cause: 400 }));
    }

    return res.status(201).json({ message: "Done", category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error("In-valid category Id", { cause: 404 }));
    }

    if (req.body.name) {
        const name = req.body.name.toLowerCase();
        if (category.name == name) {
            return next(new Error(`Sorry cannot update category with the same name`, { cause: 400 }));
        }
        else if (await categoryModel.findOne({ name })) {
            return next(new Error(`Duplicate category name - ${name}`, { cause: 409 }));
        }
        else {
            category.name = name;
            category.slug = slugify(name);
        }
    }
    
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/Category` });
        await cloudinary.uploader.destroy(category.image.public_id);
        category.image = { secure_url, public_id };
    }

    if(req.body.isDeleted){
        const products = await productModel.find({ isDeleted: false, categoryId });
        const subcategories = await subcategoryModel.find({ isDeleted: false, categoryId });
        if(req.body.isDeleted=="true" && (products?.length || subcategories?.length)){
            return next(new Error("can not delete category because there is subcatrgories or products has this category id", { cause: 400 }));
        }
        category.isDeleted = (req.body.isDeleted=="true")? true : false;
    }

    category.updatedBy = req.user._id;
    await category.save();
    return res.status(201).json({ message: "Done", category });
});


