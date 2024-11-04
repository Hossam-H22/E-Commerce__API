
import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { brandType } from "./../../Brand/GraphQl/brand.types.js";
import { categoryType } from './../../Category/GraphQl/category.type.js';
import { subcategoryType } from './../../Subcategory/GraphQl/subcategory.type.js';
import { reviewType } from "./../../Reviews/GraphQl/review.type.js";
import { productType } from "./../../Product/GraphQl/product.types.js";
import { userType } from "./../../User/GraphQl/user.type.js";


const productCartItem = new GraphQLObjectType({
    name: 'productCartItem',
    fields: {
        productId: { type: productType },
        quantity: { type: GraphQLInt },
    }
})


export const cartType = new GraphQLObjectType({
    name: 'cartTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        userId: { type: userType },
        products: { 
            type: new GraphQLList(productCartItem)
        },
    }
})