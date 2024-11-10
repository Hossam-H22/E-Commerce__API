import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { userTypeGeneral } from "./../../User/GraphQl/user.type.js";


export const reviewType = new GraphQLObjectType({
    name: 'reviewTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        comment: { type: GraphQLString },
        rating: { type: GraphQLFloat },
        createdBy: { type: userTypeGeneral },
    }
})