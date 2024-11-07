
import { 
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql';
import { imageType } from './../../Product/GraphQl/product.types.js';
import { userTypeGeneral } from './../../User/GraphQl/user.type.js';


export const categoryType = new GraphQLObjectType({
    name: 'categoryTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        image: { type: imageType('categoryImage') },
        createdBy: { type: userTypeGeneral },
        updatedBy: { type: userTypeGeneral },
        isDeleted: { type: GraphQLBoolean },
    }
})