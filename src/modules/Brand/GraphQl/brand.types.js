import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { imageType } from "./../../Product/GraphQl/product.types.js";
import { userType } from "./../../User/GraphQl/user.type.js";


export const brandType = new GraphQLObjectType({
    name: 'brandTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        image: { type: imageType('brandImage') },
        createdBy: { type: userType },
        updatedBy: { type: userType },
        isDeleted: { type: GraphQLBoolean },
    }
})