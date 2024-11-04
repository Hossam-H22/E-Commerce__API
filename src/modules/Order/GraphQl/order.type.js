import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { productType } from "./../../Product/GraphQl/product.types.js";
import { couponType } from './../../Coupon/GraphQl/coupon.type.js';
import { userType } from "./../../User/GraphQl/user.type.js";


const productOrderItem = new GraphQLObjectType({
    name: 'productOrderItem',
    fields: {
        name: { type: GraphQLString },
        productId: { type: productType },
        quantity: { type: GraphQLInt },
        unitPrice: { type: GraphQLFloat },
        finalPrice: { type: GraphQLFloat },
    }
})


export const orderType = new GraphQLObjectType({
    name: 'orderTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        userId: { type: userType },
        updatedBy: { type: userType },
        address: { type: GraphQLString },
        phone: { type: GraphQLString },
        note: { type: GraphQLString },
        products: { type: productOrderItem },
        subtotal: { type: GraphQLFloat },
        couponId: { type: couponType },
        finalPrice: { type: GraphQLFloat },
        paymentType: { type: GraphQLString },
        status: { type: GraphQLString },
        reason: { type: GraphQLString },
    }
})