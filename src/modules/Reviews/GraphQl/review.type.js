import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { userType } from "./../../User/GraphQl/user.type.js";


export const reviewType = new GraphQLObjectType({
    name: 'reviewTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        comment: { type: GraphQLString },
        rating: { type: GraphQLFloat },
        createdBy: { type: userType },
    }
})