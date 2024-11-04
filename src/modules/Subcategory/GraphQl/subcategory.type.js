
import { 
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql';
import { categoryType } from '../../Category/GraphQl/category.type.js';
import { imageType } from './../../Product/GraphQl/product.types.js';
import { userType } from './../../User/GraphQl/user.type.js';


export const subcategoryType = new GraphQLObjectType({
    name: 'subcategoryTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        customId: { type: GraphQLString },
        image: { type: imageType('subcategoryImage') },
        categoryId: { type: categoryType },
        createdBy: { type: userType },
        updatedBy: { type: userType },
        isDeleted: { type: GraphQLBoolean },
    }
})