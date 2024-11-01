import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import productModel from "../../../../DB/Models/Product.model.js";
import { productType } from "./product.types.js";
import { graphValidation } from "../../../middleware/validation.middleware.js";
import * as validators from "./../product.validation.js";
import { graphAuth, roles } from "../../../middleware/auth.middleware.js";


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
        _id: { type: new GraphQLNonNull(GraphQLID) },
        stock: { type: new GraphQLNonNull(GraphQLInt) },
        authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args) => {
        const {_id, stock, authorization} = args;

        // Authorization
        await graphAuth(authorization, [roles.Admin])

        const product = await productModel.findOneAndUpdate({ _id }, { stock }, { new: true });
        return product;
    }
}