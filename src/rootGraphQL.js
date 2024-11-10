import { GraphQLObjectType, GraphQLSchema } from "graphql"
import productSchema from './modules/Product/GraphQl/schema.js';
import brandSchema from "./modules/Brand/GraphQl/shema.js";
import categorySchema from "./modules/Category/GraphQl/schema.js";
import subcategorySchema from "./modules/Subcategory/GraphQl/schema.js";
import couponController from "./modules/Coupon/GraphQl/shema.js";

const RootGraphQL = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootGraphQLQuery',
        description: 'handel graphQl query',
        fields: {
            ...productSchema.query,
            ...brandSchema.query,
            ...categorySchema.query,
            ...subcategorySchema.query,
            ...couponController.query,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'RootGraphQLMutation',
        description: 'handel graphQl mutation',
        fields: {
            ...productSchema.mutation,
            ...brandSchema.mutation,
            ...categorySchema.mutation,
            ...subcategorySchema.mutation,
            ...couponController.mutation,
        },
    }),
});

export default RootGraphQL;