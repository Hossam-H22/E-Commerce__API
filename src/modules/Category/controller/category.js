
import categoryModel from "./../../../../DB/Models/Category.model.js";
import slugify from 'slugify'
import { asyncHandler } from "./../../../utils/errorHandling.js";
import cloudinary from "./../../../utils/cloudinary.js";



export const getCategories = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.find({ isDeleted: false }).populate([
        {
            path: 'subcategory',
        }
    ]);
    return res.status(200).json({ message: "Done", category });
});

export const getCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findById(categoryId).populate([
        {
            path: 'subcategory',
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
    const category = await categoryModel.findById(req.params.categoryId);
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

    category.updatedBy = req.user._id;
    await category.save();
    return res.status(201).json({ message: "Done", category });
});


