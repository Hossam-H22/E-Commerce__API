
import { 
    GraphQLBoolean,
    GraphQLID, 
    GraphQLList, 
    GraphQLString
} from 'graphql';
import { graphAuth } from './../../../middleware/auth.middleware.js';
import { graphValidation } from '../../../middleware/validation.middleware.js';
import * as validators from './../cart.validation.js'
import { endPoint } from './../cart.endPoint.js';
import { cartType } from './cart.type.js';
import cartModel from './../../../../DB/Models/Cart.model.js';



export const cart = {
    type: new GraphQLList(cartType),
    args: {
        authorization: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
        const { authorization } = args;

        // validation
        await graphValidation(validators.getCartGraph, args);
        
        // Authentication & Authorization 
        const user = await graphAuth(authorization, endPoint.get);

        const cart = await cartModel.find({ userId: user._id }).populate([
            { path: 'userId' },
            { path: 'products.productId' },
        ]);
        if (!cart) {
            throw new Error('Not found cart');
        }
        return cart;
    }
}