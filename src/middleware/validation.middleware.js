
import joi from "joi"
import { Types } from "mongoose"


const validateObjectId = (value, helper)=>{
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid Object ID');
}

export const generalFields = {
    id: joi.string().min(24).max(24).custom(validateObjectId).required(),
    optionalId: joi.string().min(24).max(24).custom(validateObjectId),
    userName: joi.string().alphanum().min(2).max(20).required().messages({
        'string.empty': 'Please fill in your UserName',
        'any.required': 'userName is required',
    }),
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 4, tlds: {allow: ['com', 'net', 'edu', 'eg']} }).required(),
    password : joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    gender: joi.string().alphanum().valid('male', 'female').messages({
        "any.only": "please choose male of female",
    }),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
        dest: joi.string(),
    }),
}

export const validation = (schema, considerHeaders = false) => {
    return (req, res, next) => {
        let inputs = { ...req.body, ...req.query, ...req.params }
        
        if(req.file || req.files) {
            inputs.file = req.file || req.files;
        }

        if(considerHeaders && req.headers?.authorization) {
            inputs = {authorization: req.headers.authorization};
        }

        const validationResult = schema.validate(inputs, { abortEarly: false });
        if(validationResult.error) {
            return res.status(400).json({message: "Validation Err", validationResult: validationResult.error.details})
        }

        return next();
    }
}
