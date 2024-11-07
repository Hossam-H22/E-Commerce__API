import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { imageType, productType } from "./../../Product/GraphQl/product.types.js";

const userImage = imageType('userImage');

export const userType = new GraphQLObjectType({
    name: 'userTypeName',
    description: '',
    fields: ()=>({
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        // password: { type: GraphQLString },
        gender: { type: GraphQLString },
        image: { type: userImage },
        age: { type: GraphQLInt },
        phone: { type: GraphQLString },
        address: { type: GraphQLString },
        confirmEmail: { type: GraphQLBoolean },
        status: { type: GraphQLString },
        role: { type: GraphQLString },
        DOB: { type: GraphQLString },
        wishlist: { type: new GraphQLList(productType) },
        provider: { type: GraphQLString },
    })
})

export const userTypeGeneral = new GraphQLObjectType({
    name: 'userTypeNameGeneral',
    description: '',
    fields: ()=>({
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        // password: { type: GraphQLString },
        gender: { type: GraphQLString },
        image: { type: userImage },
        age: { type: GraphQLInt },
        phone: { type: GraphQLString },
        // address: { type: GraphQLString },
        // confirmEmail: { type: GraphQLBoolean },
        status: { type: GraphQLString },
        role: { type: GraphQLString },
        // DOB: { type: GraphQLString },
        wishlist: { type: new GraphQLList(productType) },
        // provider: { type: GraphQLString },
    })
})