import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLString } from "graphql";
import slugify from "slugify";
import { subcategoryType } from "./subcategory.type.js";
import { graphValidation } from "./../../../middleware/validation.middleware.js";
import { graphAuth } from "./../../../middleware/auth.middleware.js";
import * as validators from './../subcategory.validation.js'
import { endPoint } from "./../subcategory.endPoint.js";
import productModel from "./../../../../DB/Models/Product.model.js";
import categoryModel from "./../../../../DB/Models/Category.model.js";
import subcategoryModel from "./../../../../DB/Models/Subcategory.model.js";


export const subcategories = {
    type: new GraphQLList(subcategoryType),
    resolve: async (parent, args)=>{
        const subcategories = await subcategoryModel.find({ isDeleted: false }).populate([
            { path: 'categoryId' }
        ]);
        return subcategories;
    }
}

export const getSubcategoryById = {
    type: subcategoryType,
    args: {
        subcategoryId: { type: GraphQLID },
    },
    resolve: async (parent, args) => {
        // validation
        await graphValidation(validators.getSubcategory, args);

        const subcategory = await subcategoryModel.find({ _id: args.subcategoryId, isDeleted: false }).populate([
            { path: 'categoryId' }
        ]);
        return subcategory
    }
}

export const updateSubcategory = {
    type: subcategoryType,
    args: {
        subcategoryId: { type: GraphQLID },
        categoryId: { type: GraphQLID },
        authorization: { type: GraphQLString },
        name: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
    },
    resolve: async (parent, args) => {
        const { subcategoryId, categoryId, authorization } = args;

        // validation
        await graphValidation(validators.updateSubcategoryGraph, args);
        
        // Authentication & Authorization 
        const user = await graphAuth(authorization, endPoint.update);

        const subcategory = await subcategoryModel.findOne({ _id:subcategoryId, categoryId });
        if(!subcategory) {
            throw new Error("In-valid sub-category Id");
        }
        
        if(args.name){
            const name = args.name.toLowerCase();
            if(subcategory.name == name) {
                throw new Error(`Sorry cannot update subcategory with the same name`);
            }
            else if (await subcategoryModel.findOne({ name })) {
                throw new Error(`Duplicate subcategory name - ${name}`);
            }
            else {
                subcategory.name = name;
                subcategory.slug = slugify(name) 
            }
        }

        if(args.isDeleted){
            const products = await productModel.find({ isDeleted: false, subcategoryId });
            if(args.isDeleted=="true" && products?.length){
                throw new Error("can not delete subcategory because some products has this subcategory id");
            }
            subcategory.isDeleted = (args.isDeleted=="true")? true : false;
        }

        subcategory.updatedBy = user._id;
        await subcategory.save();
        return subcategory;
    }
}