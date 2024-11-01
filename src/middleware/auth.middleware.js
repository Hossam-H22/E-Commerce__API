


import { verifyToken } from '../utils/generateAndVerifyToken.js';
import userModel from './../../DB/Models/User.model.js';
import { asyncHandler } from './../utils/errorHandling.js';

export const roles = {
    Admin: 'Admin',
    User: 'User',
    Seller: 'Seller',
}

export const auth = (accessRoles = []) => {
    return asyncHandler( async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return next(new Error("In-valid Bearer key", { cause: 400 }));
        }
    
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return next(new Error("Token is required", { cause: 400 }));
        }
    
        // Decode Token
        const decodedToken = verifyToken({ token });
        if (!decodedToken?.id || !decodedToken?.isLoggedIn) {
            return next(new Error("In-valid token", { cause: 400 }));
        }
    
        const authUser = await userModel.findById(decodedToken.id).select("userName email status role changePasswordTime");
        if (!authUser) {
            return next(new Error("Not register account", { cause: 401 }));
        }

        if(authUser.changePasswordTime && parseInt(authUser.changePasswordTime.getTime()/1000) > decodedToken.iat){
            return next(new Error("Expired token", { cause: 400 }));
        }
        
        if(!accessRoles.includes(authUser.role)) {
            return next(new Error("Not authorized account", { cause: 403 }));
        }

        req.user = authUser;
        return next();
    })
}

