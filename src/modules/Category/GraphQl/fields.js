import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLString } from "graphql";
import { categoryType } from "./category.type.js";
import categoryModel from "./../../../../DB/Models/Category.model.js";
import { graphValidation } from "./../../../middleware/validation.middleware.js";
import * as validators from './../category.validation.js'
import slugify from "slugify";
import productModel from "./../../../../DB/Models/Product.model.js";
import subcategoryModel from "../../../../DB/Models/Subcategory.model.js";
import { graphAuth } from "./../../../middleware/auth.middleware.js";
import { endPoint } from "./../category.endPoint.js";


export const categories = {
    type: new GraphQLList(categoryType),
    resolve: async (parent, args)=>{
        const categories = await categoryModel.find({ isDeleted: false });
        return categories;
    }
}

export const getCategoryById = {
    type: categoryType,
    args: {
        categoryId: { type: GraphQLID },
    },
    resolve: async (parent, args) => {
        // validation
        await graphValidation(validators.getCategory, args);

        const category = await categoryModel.findOne({
            _id: args.categoryId,
            isDeleted: false
        })

        return category;
    }
}

export const updateCategory = {
    type: categoryType,
    args: {
        categoryId: { type: GraphQLID },
        authorization: { type: GraphQLString },
        name: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
    },
    resolve: async (parent, args) => {
        const { categoryId, authorization } = args;

        // validation
        await graphValidation(validators.updateCategoryGraph, args);
        
        // Authentication & Authorization 
        const user = await graphAuth(authorization, endPoint.update);

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            throw Error("In-valid category Id");
        }

        if (args.name) {
            const name = args.name.toLowerCase();
            if (category.name == name) {
                throw Error(`Sorry cannot update category with the same name`);
            }
            else if (await categoryModel.findOne({ name })) {
                throw Error(`Duplicate category name - ${name}`);
            }
            else {
                category.name = name;
                category.slug = slugify(name);
            }
        }
        
        if(args.isDeleted){
            const products = await productModel.find({ isDeleted: false, categoryId });
            const subcategories = await subcategoryModel.find({ isDeleted: false, categoryId });
            if(args.isDeleted=="true" && (products?.length || subcategories?.length)){
                throw Error("can not delete category because there is subcatrgories or products has this category id");
            }
            category.isDeleted = (args.isDeleted=="true")? true : false;
        }

        category.updatedBy = user._id;
        await category.save();
        return category;
    }
}