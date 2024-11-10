import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as categoryController from "./fields.js";



const categorySchema = {
    query: {
        categories: categoryController.categories,
        getCategoryById: categoryController.getCategoryById,
    },
    mutation: {
        updateCategory: categoryController.updateCategory,
    }
};


export default categorySchema;