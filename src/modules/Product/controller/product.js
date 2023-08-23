
import subcategoryModel from './../../../../DB/Models/Subcategory.model.js';
import productModel from './../../../../DB/Models/Product.model.js';
import { asyncHandler } from "./../../../utils/errorHandling.js";
import brandModel from './../../../../DB/Models/Brand.model.js';
import userModel from './../../../../DB/Models/User.model.js';
import ApiFeatures from './../../../utils/apiFeatures.js';
import cloudinary from "./../../../utils/cloudinary.js";
import { nanoid } from 'nanoid';
import slugify from 'slugify'



export const getProductList = asyncHandler(async (req, res, next) => {
    const totalNumberOfData = await productModel.countDocuments({ isDeleted: false });
    const apiFeature = new ApiFeatures(productModel.find({ isDeleted: false }), req.query).populate().filter().sort().search().select().paginate();
    const productsList = await apiFeature.mongooseQuery;
    apiFeature.metadata = {
        totalNumberOfData,
        limit: apiFeature.limit,
        numberOfPages: Math.floor(totalNumberOfData/apiFeature.limit) || 1,
        currentPage: apiFeature.page,
    }
    const restPages = Math.floor(totalNumberOfData/apiFeature.limit) - apiFeature.page;
    if(restPages>0) apiFeature.metadata.nextPage = restPages;

    return res.status(200).json({ message: "Done", metadata: apiFeature.metadata, data: productsList });
});

export const getProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findOne({ _id: productId, isDeleted: false }).populate([
        {
            path: 'categoryId'
        },
        {
            path: 'subcategoryId'
        },
        {
            path: 'brandId'
        },
        {
            path: 'reviews'
        },
    ]);
    return res.status(200).json({ message: "Done", product });
});

export const createProduct = asyncHandler(async (req, res, next) => {
    const { categoryId, subcategoryId, brandId, price, discount } = req.body;

    if (! await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
        return next(new Error("In-valid category or subcategory id", { cause: 400 }));
    }
    if (! await brandModel.findOne({ _id: brandId })) {
        return next(new Error("In-valid brand id", { cause: 400 }));
    }

    req.body.name = req.body.name.toLowerCase();
    req.body.slug = slugify(req.body.name, {
        replacement: '-',
        trim: true,
        lower: true,
    });
    req.body.finalPrice = Number.parseFloat(((100 - (discount || 0)) / 100) * price).toFixed(2);
    req.body.createdBy = req.user._id;
    req.body.customId = nanoid();


    // uploade new photos
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `${process.env.APP_NAME}/Product/${req.body.customId}` }
    );
    req.body.mainImage = { secure_url, public_id };

    if (req.files.subImages) {
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `${process.env.APP_NAME}/Product/${req.body.customId}/subImages` }
            );
            req.body.subImages.push({ secure_url, public_id });
        }
    }


    const product = await productModel.create(req.body);
    if (!product) {
        return next(new Error("Failed to create your product", { cause: 400 }));
    }
    return res.status(201).json({ message: "Done", product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {

    // check product exist
    const { productId } = req.params;
    let product = await productModel.findById(productId);
    if (!product) {
        return next(new Error("In-valid product id", { cause: 400 }));
    }

    // check user authorization
    if (req.user.role == "Seller" && req.user._id != product.createdBy) {
        return next(new Error("You are not authorized to update this product", { cause: 403 }));
    }

    // destruct main fields
    const { name, categoryId, subcategoryId, brandId, price, discount } = req.body;

    // check category and brand
    if (categoryId && subcategoryId) {
        if (! await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
            return next(new Error("In-valid category or subcategory id", { cause: 400 }));
        }
    }
    if (brandId) {
        if (! await brandModel.findOne({ _id: brandId })) {
            return next(new Error("In-valid brand id", { cause: 400 }));
        }
    }

    // update slug
    if (name) {
        req.body.name.toLowerCase();
        req.body.slug = slugify(req.body.name, {
            replacement: '-',
            trim: true,
            lower: true,
        });
    }

    // update price
    if (price || discount) {
        req.body.price = price || product.price;
        req.body.discount = discount || product.discount;
        req.body.finalPrice = Number.parseFloat(((100 - (discount || product.discount)) / 100) * (price || product.price)).toFixed(2);
    }


    // update images
    if (req.files?.mainImage?.length) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.mainImage[0].path,
            { folder: `${process.env.APP_NAME}/Product/${product.customId}` }
        );
        await cloudinary.uploader.destroy(product.mainImage.public_id);
        req.body.mainImage = { secure_url, public_id };
    }
    if (req.files?.subImages?.length) {
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `${process.env.APP_NAME}/Product/${product.customId}/subImages` }
            );
            req.body.subImages.push({ secure_url, public_id });
        }
        if (product.subImages?.length) {
            for (const image of product.subImages) await cloudinary.uploader.destroy(image.public_id);
        }
    }

    req.body.updatedBy = req.user._id;
    product = await productModel.findOneAndUpdate({ _id: product._id }, req.body, { new: true });
    return res.status(200).json(product.isDeleted ? { message: "Done" } : { message: "Done", product });
});

export const addToWishlist = asyncHandler(async (req, res, next) => {

    // check product exist
    const { productId } = req.params;
    let product = await productModel.findById(productId);
    if (!product) {
        return next(new Error("In-valid product id", { cause: 400 }));
    }

    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: productId } });
    return res.status(200).json({ message: "Done" });
});

export const removeFromWishlist = asyncHandler(async (req, res, next) => {

    // check product exist
    const { productId } = req.params;
    let product = await productModel.findById(productId);
    if (!product) {
        return next(new Error("In-valid product id", { cause: 400 }));
    }

    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishlist: productId } });
    return res.status(200).json({ message: "Done" });
});