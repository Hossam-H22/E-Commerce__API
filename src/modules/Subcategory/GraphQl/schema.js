import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as subcategoriesController from "./fields.js";



const subcategorySchema = {
    query: {
        subcategories: subcategoriesController.subcategories,
        getSubcategoriesById: subcategoriesController.getSubcategoryById,
    },
    mutation: {
        updateSubcategory: subcategoriesController.updateSubcategory,
    }
};


export default subcategorySchema;