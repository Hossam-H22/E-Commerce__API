import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";
import { brandType } from "./../../Brand/GraphQl/brand.types.js";
import { categoryType } from './../../Category/GraphQl/category.type.js';
import { subcategoryType } from './../../Subcategory/GraphQl/subcategory.type.js';
import { reviewType } from "./../../Reviews/GraphQl/review.type.js";
import { userType } from "./../../User/GraphQl/user.type.js";


export function imageType(name) {
    
    return new GraphQLObjectType({
        name: name || 'imageType',
        description: '',
        fields: {
            secure_url: { type: GraphQLString },
            public_id: { type: GraphQLString },
        }
    })
}


const imageTypeObj = imageType('productImage');

export const productType = new GraphQLObjectType({
    name: 'productTypeName',
    description: '',
    fields: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        stock: { type: GraphQLInt },
        price: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        finalPrice: { type: GraphQLFloat },
        colors: { type: new GraphQLList(GraphQLString) },
        sizes: { type: new GraphQLList(GraphQLString) },
        categoryId: { type: categoryType },
        subcategoryId: { type: subcategoryType },
        brandId: { type: brandType },
        reviews: { type: new GraphQLList(reviewType) },
        mainImage: { type: imageTypeObj },
        subImages: { type: new GraphQLList(imageTypeObj) },
        numOfRating: { type: GraphQLInt },
        avgRating: { type: GraphQLFloat },
        totalRating: { type: GraphQLFloat },
        isDeleted: { type: GraphQLBoolean },
        createdBy: { type: userType },
        updatedBy: { type: userType },
    }
})