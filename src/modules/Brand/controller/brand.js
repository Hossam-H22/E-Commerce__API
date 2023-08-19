
import brandModel from "./../../../../DB/Models/Brand.model.js";
import slugify from 'slugify'
import { asyncHandler } from "./../../../utils/errorHandling.js";
import cloudinary from "./../../../utils/cloudinary.js";



export const getBrands = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find({ isDeleted: false });
    return res.status(200).json({ message: "Done", brand});
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
    const brand = await brandModel.findById(req.params.brandId);
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
    brand.updatedBy = req.user._id;
    await brand.save();
    return res.status(201).json({ message: "Done", brand});
});


