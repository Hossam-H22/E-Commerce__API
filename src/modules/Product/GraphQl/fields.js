import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import productModel from "../../../../DB/Models/Product.model.js";
import { productType } from "./product.types.js";
import { graphValidation } from "../../../middleware/validation.middleware.js";
import * as validators from "./../product.validation.js";


export const products = {
    type: new GraphQLList(productType),
    resolve: async (parent, args)=>{
        const products = await productModel.find();
        return products;
    }
}

export const getProductById = {
    type: productType,
    args: {
        productId: { type: GraphQLID },
    },
    resolve: async (parent, args)=>{
        // validation
        await graphValidation(validators.getProduct, args);

        const product = await productModel.findById(args.productId);
        return product;
    }
}

export const updateStock = {
    type: productType,
    args: {
        _id: { type: GraphQLID },
        stock: { type: GraphQLInt },
    },
    resolve: async (parent, args) => {
        const {_id, stock} = args;
        const product = await productModel.findOneAndUpdate({ _id }, { stock }, { new: true });
        return product;
    }
}