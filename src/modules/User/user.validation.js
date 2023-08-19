import { generalFields } from "./../../middleware/validation.middleware.js";
import joi from "joi";


export const updatePassword = joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password.invalid(joi.ref("oldPassword")),
    cPassword: generalFields.cPassword.valid(joi.ref("newPassword")),
}).required();


// export const shareProfile = joi.object({
//     id: generalFields.id,
// }).required();


// export const profilePic = joi.object({
//     file: generalFields.file.required(),
// }).required();
