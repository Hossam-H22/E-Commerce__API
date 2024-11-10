
import { 
    GraphQLBoolean,
    GraphQLID, 
    GraphQLList, 
    GraphQLString
} from 'graphql';
import { graphAuth } from './../../../middleware/auth.middleware.js';
import { graphValidation } from '../../../middleware/validation.middleware.js';
import * as validators from './../order.validation.js'
import { endPoint } from './../order.endPoint.js';
import { orderType } from './order.type.js';
import orderModel from './../../../../DB/Models/Order.model.js';



export const orders = {
    type: new GraphQLList(orderType),
    args: {
        authorization: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
        const { authorization } = args;

        // validation
        await graphValidation(validators.getOrderGraph, args);
        
        // Authentication & Authorization 
        const user = await graphAuth(authorization, endPoint.get);

        const orders = await orderModel.find({ userId: user._id }).populate([
            { path: 'userId' },
            { path: 'updatedBy' },
            { path: 'couponId' },
            { path: 'products.productId' },
        ]);
        return orders;
    }
}