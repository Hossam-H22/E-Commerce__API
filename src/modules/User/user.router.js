
import { fileUpload, fileValidation } from './../../utils/cloudMulter.js';
import validation from './../../middleware/validation.middleware.js';
import auth from './../../middleware/auth.middleware.js';
import * as userController from './controller/user.js';
import * as validators from "./user.validation.js"
import { endPoint } from './user.endPoint.js';
import { Router } from 'express'

const router = Router();

router.get(
    "/",
    auth(endPoint.all), 
    userController.getUser,
);

router.get(
    "/all",
    auth(endPoint.admin), 
    userController.getUsers,
);

router.patch(
    "/updatePassword", 
    auth(endPoint.all), 
    validation(validators.updatePassword), 
    userController.updatePassword
);





// router.get("/profile", auth, userController.profile);

// router.get(
//     "/:id/profile", 
//     validation(validators.shareProfile), 
//     userController.shareProfile
// );


// router.patch(
//     "/profilePic", 
//     auth(endPoint.all), 
//     fileUpload(fileValidation.image).single('image'), 
//     validation(validators.profilePic),
//     userController.profilePic
// );

// router.patch(
//     "/profileCovPic", 
//     auth, 
//     fileUpload(fileValidation.image).array('image', 5), 
//     validation(validators.profileCovPic),
//     userController.profileCovPic
// );



export default router;