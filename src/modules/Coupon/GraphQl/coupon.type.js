import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { imageType } from "./../../Product/GraphQl/product.types.js";
import { userType } from "./../../User/GraphQl/user.type.js";




export const couponType = new GraphQLObjectType({
    name: 'couponTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        expireDate: { type: GraphQLString },
        image: { type: imageType('couponImage') },
        createdBy: { type: userType },
        usedBy: { type: new GraphQLList(userType) },
        isDeleted: { type: GraphQLBoolean },
    }
})