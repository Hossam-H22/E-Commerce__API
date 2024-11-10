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
import subcategoryModel from "../../../../DB/Models/Subcategory.model.js";
import brandModel from "../../../../DB/Models/Brand.model.js";
import slugify from "slugify";


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

        // check product exist
        let product = await productModel.findById(productId);
        if (!product) {
            throw Error("In-valid product id");
        }

        // check user authorization
        if (user.role == "Seller" && user._id != product.createdBy) {
            throw new Error("You are not authorized to update this product");
        }

        // destruct main fields
        const { name, categoryId, subcategoryId, brandId, price, discount } = args;

        // check category and brand
        if (categoryId && subcategoryId) {
            if (! await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
                throw new Error("In-valid category or subcategory id");
            }
        }
        if (brandId) {
            if (! await brandModel.findOne({ _id: brandId })) {
                throw new Error("In-valid brand id");
            }
        }

        // update slug
        if (name) {
            args.name.toLowerCase();
            args.slug = slugify(args.name, {
                replacement: '-',
                trim: true,
                lower: true,
            });
        }

        // update price
        if (price || discount) {
            args.price = price || product.price;
            args.discount = discount || product.discount;
            args.finalPrice = Number.parseFloat(((100 - (discount || product.discount)) / 100) * (price || product.price)).toFixed(2);
        }

        args.updatedBy = user._id;
        product = await productModel.findOneAndUpdate({ _id: product._id }, args, { new: true });
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