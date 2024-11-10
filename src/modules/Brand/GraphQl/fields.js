
import { 
    GraphQLBoolean,
    GraphQLID, 
    GraphQLList, 
    GraphQLString
} from 'graphql';
import { brandType } from './brand.types.js';
import brandModel from './../../../../DB/Models/Brand.model.js';
import * as validators from './../brand.validation.js'
import { graphAuth } from './../../../middleware/auth.middleware.js';
import { endPoint } from './../brand.endPoint.js';
import { graphValidation } from '../../../middleware/validation.middleware.js';
import slugify from 'slugify';


export const brands = {
    type: new GraphQLList(brandType),
    resolve: async (parent, args)=>{
        const brands = await brandModel.find({ isDeleted: false });
        return brands;
    }
}


export const getBrandById = {
    type: brandType,
    args: {
        brandId: { type: GraphQLID },
    },
    resolve: async (parent, args) => {
        // validation
        await graphValidation(validators.getBrand, args);

        const brand = await brandModel.findOne({
            _id: args.productId,
            isDeleted: false
        })

        return brand;
    }
}


export const updateBrand = {
    type: brandType,
    args: {
        brandId: { type: GraphQLID },
        authorization: { type: GraphQLString },
        name: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
    },
    resolve: async (parent, args) => {
        const { brandId, authorization } = args;

        // validation
        await graphValidation(validators.updateBrandGraph, args);
        
        // Authentication & Authorization 
        const user = await graphAuth(authorization, endPoint.update);

        const brand = await brandModel.findById(brandId);
        if(!brand) {
            throw new Error("In-valid brand Id");
        }

        if(args?.name){
            const name = args?.name.toLowerCase();
            if (brand.name == name) {
                throw new Error("Sorry cannot update brand with the same name");
            }
            else if(await brandModel.findOne({ name: name })){
                throw new Error("Duplicated brand name");
            }
            else {
                brand.name = name; 
                brand.slug = slugify(name) 
            }
        }
        
        if(args?.isDeleted){
            const products = await productModel.find({ isDeleted: false, brandId });
            if(args?.isDeleted=="true" && products?.length){
                throw new Error("can not delete brand because some products has this brand id");
            }
            brand.isDeleted = (args?.isDeleted=="true")? true : false;
        }

        brand.updatedBy = user._id;
        await brand.save();

        return brand;
    }
}