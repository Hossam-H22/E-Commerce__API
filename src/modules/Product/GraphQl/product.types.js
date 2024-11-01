import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
} from "graphql";


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
        brandId: { type: GraphQLID },
        categoryId: { type: GraphQLID },
        subcategoryId: { type: GraphQLID },
        brandId: { type: GraphQLID },
        mainImage: { type: imageTypeObj },
        subImages: { type: new GraphQLList(imageTypeObj) },
        numOfRating: { type: GraphQLInt },
        avgRating: { type: GraphQLFloat },
        totalRating: { type: GraphQLFloat },
        isDeleted: { type: GraphQLBoolean },
    }
})