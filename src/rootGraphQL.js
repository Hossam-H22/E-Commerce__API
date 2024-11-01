import { GraphQLObjectType, GraphQLSchema } from "graphql"
import productSchema from './modules/Product/GraphQl/schema.js';

const RootGraphQL = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootGraphQLQuery',
        description: 'handel graphQl query',
        fields: {
            ...productSchema.query,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'RootGraphQLMutation',
        description: 'handel graphQl mutation',
        fields: {
            ...productSchema.mutation,
        },
    }),
});

export default RootGraphQL;