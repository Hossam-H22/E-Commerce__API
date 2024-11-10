
import { 
    GraphQLBoolean,
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLString
} from 'graphql';
import slugify from 'slugify';
import * as validators from './../coupon.validation.js'
import { graphAuth } from './../../../middleware/auth.middleware.js';
import { graphValidation } from '../../../middleware/validation.middleware.js';
import { endPoint } from './../coupon.endPoint.js';
import { couponType } from './coupon.type';
import couponModel from './../../../../DB/Models/Coupon.model';


export const coupons = {
    type: new GraphQLList(couponType),
    resolve: async (parent, args)=>{
        const coupons = await couponModel.find({ isDeleted: false });
        return coupons;
    }
}


export const getCouponById = {
    type: couponType,
    args: {
        couponId: { type: GraphQLID },
    },
    resolve: async (parent, args) => {
        // validation
        await graphValidation(validators.getBrand, args);

        const coupon = await couponModel.findOne({
            _id: args.couponId,
            isDeleted: false
        })

        return coupon;
    }
}


export const updateCoupon = {
    type: couponType,
    args: {
        couponId: { type: GraphQLID },
        authorization: { type: GraphQLString },
        name: { type: GraphQLString },
        amount: { type: GraphQLInt },
        expireDate: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
    },
    resolve: async (parent, args) => {
        const { couponId, authorization } = args;

        // validation
        await graphValidation(validators.updateBrandGraph, args);
        
        // Authentication & Authorization 
        const user = await graphAuth(authorization, endPoint.update);

        const coupon = await couponModel.findById(couponId);
        if(!coupon) {
            throw new Error("In-valid coupon Id");
        }
        if(args.name){
            const name = args.name.toLowerCase();
            if (coupon.name == name) {
                throw new Error("Sorry cannot update coupon with the same name");
            }
            else if(await couponModel.findOne({ name: name })){
                throw new Error("Duplicated coupon name");
            }
            else {
                coupon.name = name; 
            }
        }
        if(args.amount){
            coupon.amount = args.amount;
        }
        if(args.expireDate){
            coupon.expireDate = new Date(args.expireDate);
        }
        if(args.isDeleted){
            coupon.isDeleted = (args.isDeleted=="true")? true : false;
        }

        await coupon.save();
        return coupon;
    }
}