import { GraphQLObjectType, GraphQLSchema } from "graphql"
import productSchema from './modules/Product/GraphQl/schema.js';
import brandSchema from "./modules/Brand/GraphQl/shema.js";
import categorySchema from "./modules/Category/GraphQl/schema.js";

const RootGraphQL = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootGraphQLQuery',
        description: 'handel graphQl query',
        fields: {
            ...productSchema.query,
            ...brandSchema.query,
            ...categorySchema.query,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'RootGraphQLMutation',
        description: 'handel graphQl mutation',
        fields: {
            ...productSchema.mutation,
            ...brandSchema.mutation,
            ...categorySchema.mutation,
        },
    }),
});

export default RootGraphQL;