

import { compare, hash } from './../../../utils/hashAndCompare.js';
import { asyncHandler } from './../../../utils/errorHandling.js';
import userModel from './../../../../DB/Models/User.model.js';
import ApiFeatures from './../../../utils/apiFeatures.js';
import cloudinary from './../../../utils/cloudinary.js';


export const getUsers = asyncHandler(async (req, res, next) => {
    const totalNumberData = await userModel.countDocuments();
    const apiFeature = new ApiFeatures(userModel.find(), req.query).select().paginate();
    const usersList = await apiFeature.mongooseQuery;
    apiFeature.metadata = {
        totalNumberData,
        limit: apiFeature.limit,
        numberOfPages: Math.floor(totalNumberData/apiFeature.limit) || 1,
        currentPage: apiFeature.page,
    }
    const restPages = Math.floor(totalNumberData/apiFeature.limit) - apiFeature.page;
    if(restPages>0) apiFeature.metadata.nextPage = restPages;

    return res.status(200).json({ message: "Done", metadata: apiFeature.metadata, data: usersList });
});


export const getUser = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(userModel.findById(req.user._id), req.query).select();
    const user = await apiFeature.mongooseQuery;
    return res.status(200).json({ message: "Done", user })
});


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);
    const match = compare({ plainText: oldPassword, hashValue: user.password })
    if (!match) {
        return next(new Error("In-valid old password", { case: 400 }));
    }
    const hashPassword = hash({ plainText: newPassword })
    user.password = hashPassword;
    user.changePasswordTime = Date.now();
    await user.save();

    return res.status(200).json({ message: "Done" });
});













// export const profile = asyncHandler(async (req, res, next) => {
//     const user = await userModel.findById(req.user._id);
//     return user ? res.status(200).json({ message: "Done", user }) : next(new Error("Not register account", { case: 404 }));
// });


// export const shareProfile = asyncHandler(async (req, res, next) => {
//     const user = await userModel.findById(req.params.id).select('userName email profilePic firstName lastName');
//     QRCode.toDataURL(`${req.protocol}://${req.headers.host}/user/${user._id}/profile`, function (err, url) {
//         return user ? res.status(200).json({ message: "Done", user, url })
//         : next(new Error("In-valid account id", { case: 404 }));
//     });
// });





// export const profilePic = asyncHandler(async (req, res, next) => {
//     if (!req.file) {
//         return next(new Error('File is required', { cause: 400 }));
//     }

//     // uploade new photo
//     const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `user/${req.user._id}/profile` });

//     // add new photo data to database
//     const user = await userModel.findByIdAndUpdate(req.user._id, { profilePic: secure_url, profilePicId: public_id }, { new: false });

//     // remove old photo from cloudinary
//     await cloudinary.uploader.destroy(user.profilePicId);

//     return res.status(200).json({ message: "Done"});
// })

// export const profileCovPic = asyncHandler(async (req, res, next) => {
//     if (!req.files?.length) {
//         return next(new Error('File is required', { cause: 400 }));
//     }
//     const coverPic = [];
//     for(const file of req.files) {
//         // uploade new photo
//         const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `user/${req.user._id}/profile/cover` });
//         coverPic.push({ secure_url, public_id });
//     };

//     const user = await userModel.findByIdAndUpdate(req.user._id, { coverPic }, { new: false });

//     // for(const file of user.coverPic) {
//     //    // remove old photo from cloudinary
//     //     await cloudinary.uploader.destroy(file.public_id);
//     // }
//     return res.status(200).json({ message: "Done"});
// })


