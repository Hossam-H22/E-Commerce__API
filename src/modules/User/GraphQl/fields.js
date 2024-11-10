
import { 
    GraphQLBoolean,
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLString
} from 'graphql';
import { graphAuth } from './../../../middleware/auth.middleware.js';
import { graphValidation } from '../../../middleware/validation.middleware.js';
import * as validators from './../user.validation.js'
import { endPoint } from './../user.endPoint.js';
import { userType } from './user.type.js';
import userModel from './../../../../DB/Models/User.model.js';



export const users = {
    type: new GraphQLList(userType),
    args: {
        authorization: { type: GraphQLString },
    },
    resolve: async (parent, args)=>{
        // validation
        await graphValidation(validators.getUser, args);

        // Authentication & Authorization 
        const user = await graphAuth(args.authorization, endPoint.admin);

        const users = await userModel.find();
        return users;
    }
}

export const getUserInformation = {
    type: new GraphQLList(userType),
    args: {
        authorization: { type: GraphQLString },
    },
    resolve: async (parent, args)=>{
        // validation
        await graphValidation(validators.getUser, args);

        // Authentication & Authorization 
        const user = await graphAuth(args.authorization, endPoint.admin);

        const userInfo = await userModel.find({ _id: user._id });
        return userInfo;
    }
}
