
import { Schema, Types, model } from "mongoose";
import mongoose from 'mongoose'

const productSchema = new Schema({
    customId: String, // for using it when uploaing images
    name: { type: String, required: true, trim: true, lowercase: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: String,
    
    stock: { type: Number, default: 1, required: true, },
    price: { type: Number, default: 1, required: true, },
    discount: { type: Number, default: 0, required: true, },
    finalPrice: { type: Number, default: 1, required: true, }, 
    
    colors: [String],
    sizes: [String],
    
    mainImage: { type: Object, required: true, },
    subImages: { type: [Object], },

    categoryId: { type: Types.ObjectId, ref:'Category', required: true, },
    subcategoryId: { type: Types.ObjectId, ref:'Subcategory', required: true, },
    brandId: { type: Types.ObjectId, ref:'Brand', required: true, },

    createdBy: { type: Types.ObjectId, ref:'User', required: true, },
    updatedBy: { type: Types.ObjectId, ref:'User', },

    wishUserList: [{
        userId: { type: Types.ObjectId, ref:'User' },
        quantity: { type: Number, default: 1 },
    }],
    numOfSoldItems: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    numOfRating: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
});

const productModel = mongoose.models.Product || model('Product', productSchema);

export default productModel;