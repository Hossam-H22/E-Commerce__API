import { 
    GraphQLFloat, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLBoolean 
} from "graphql";
import productModel from "./../../../../DB/Models/Product.model.js";
import { productType } from "./product.types.js";
import { graphValidation } from "../../../middleware/validation.middleware.js";
import * as validators from "./../product.validation.js";
import { graphAuth } from "./../../../middleware/auth.middleware.js";
import { endPoint } from "./../product.endPoint.js";
import { userTypeGeneral } from "./../../User/GraphQl/user.type.js";
import userModel from "../../../../DB/Models/User.model.js";


export const products = {
    type: new GraphQLList(productType),
    resolve: async (parent, args) => {
        const products = await productModel.find({
            isDeleted: false
        }).populate([
            { path: 'categoryId' },
            { path: 'subcategoryId' },
            { path: 'brandId' },
            { path: 'reviews' },
        ]);
        return products;
    }
}


export const getProductById = {
    type: productType,
    args: {
        productId: { type: GraphQLID },
    },
    resolve: async (parent, args) => {
        // validation
        await graphValidation(validators.getProduct, args);

        const product = await productModel.findOne({
            _id: args.productId,
            isDeleted: false
        }).populate([
            { path: 'categoryId' },
            { path: 'subcategoryId' },
            { path: 'brandId' },
            { path: 'reviews' },
        ]);

        return product;
    }
}


export const updateProduct = {
    type: productType,
    args: {
        productId: { type: new GraphQLNonNull(GraphQLID) },
        authorization: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        colors: { type: new GraphQLList(GraphQLString) },
        sizes: { type: new GraphQLList(GraphQLString) },
        stock: { type: GraphQLInt },
        price: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        isDeleted: { type: GraphQLBoolean },
        categoryId: { type: GraphQLID },
        subcategoryId: { type: GraphQLID },
        brandId: { type: GraphQLID },
    },
    resolve: async (parent, args) => {
        const { productId, authorization } = args;

        // validation
        await graphValidation(validators.updateProductGraph, args);

        // Authorization
        const user = await graphAuth(authorization, endPoint.update);

        const product = await productModel.findOneAndUpdate({ _id: productId }, args, { new: true });
        return product;
    }
}


export const addToWishlist = {
    type: userTypeGeneral,
    args: {
        productId: { type: new GraphQLNonNull(GraphQLID) },
        authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args) => {
        const { productId, authorization } = args;

        // validation
        await graphValidation(validators.wishlistGraph, args);

        // Authorization
        const user = await graphAuth(authorization, endPoint.wishlist);

        let product = await productModel.findById(productId);
        if (!product) {
            throw new Error("In-valid product id");
        }

        const userUpdated = await userModel.findOneAndUpdate({ _id: user._id }, { $addToSet: { wishlist: productId } }, { new: true }).populate([
            { path: 'wishlist' }
        ]);
        return userUpdated;
    }
}


export const removeFromWishlist = {
    type: userTypeGeneral,
    args: {
        productId: { type: new GraphQLNonNull(GraphQLID) },
        authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args) => {
        const { productId, authorization } = args;

        // validation
        await graphValidation(validators.wishlistGraph, args);

        // Authorization
        const user = await graphAuth(authorization, endPoint.wishlist);

        let product = await productModel.findById(productId);
        if (!product) {
            throw new Error("In-valid product id");
        }

        const userUpdated = await userModel.findOneAndUpdate({ _id: user._id }, { $pull: { wishlist: productId } }, { new: true }).populate([
            { path: 'wishlist' }
        ]);
        return userUpdated;
    }
}