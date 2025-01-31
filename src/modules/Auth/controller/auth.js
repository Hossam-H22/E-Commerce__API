import userModel from "./../../../../DB/Models/User.model.js";
import { compare, hash } from "./../../../utils/hashAndCompare.js";
import { generateToken, verifyToken } from "./../../../utils/generateAndVerifyToken.js";
import { asyncHandler } from "./../../../utils/errorHandling.js";
import sendEmail from "./../../../utils/sendEmail.js";
import { OAuth2Client } from 'google-auth-library'
import { customAlphabet } from 'nanoid';
import { getEmailConfirmTemplate, getEmailForgetPasswordTemplate } from "../../../utils/emailTemplate.js";


export const signup = asyncHandler(async (req, res, next) => {
  let { email, password, frontUrl } = req.body;
  email = email.toLowerCase();
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("Email exist", { case: 409 }));
  }

  // confirmation Email
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 5
  });
  const link1 = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}?frontUrl=${frontUrl}`;

  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 60 * 24 * 30
  });
  const link2 = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}?frontUrl=${frontUrl}`;

  const html = getEmailConfirmTemplate({
    confirmEmailLink: link1,
    resendEmailLink: link2
  });

  if (!await sendEmail({ to: email, subject: "Confirm Email", html })) {
    return next(new Error("Rejected Emal", { cause: 400 }))
  }

  // hash password
  const hashPassword = hash({ plainText: password });
  req.body.password = hashPassword;

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/User` });
    req.body.image = { secure_url, public_id };
  }

  const user = await userModel.create(req.body);
  return res.status(201).json({ message: "Done", user: user._id });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { frontUrl } = req.query;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE
  });
  if (!email) {
    return next(new Error("In-valid token payload", { case: 400 }));
  }
  const user = await userModel.updateOne({ email }, { confirmEmail: true });
  return user.modifiedCount ? res.status(200).redirect(`${frontUrl || process.env.FE_URL}`)
    : res.status(400).send('Not register account');
});


// generate template for return of function ( email sent please check it )
export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { frontUrl } = req.query;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE
  });
  if (!email) {
    return next(new Error("In-valid Token payload", { case: 400 }));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Not register account", { case: 404 }));
  }
  if (user.confirmEmail) {
    return res.status(200).redirect(`${frontUrl || process.env.FE_URL}`);
  }

  const newtoken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 2
  });
  const link1 = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}?frontUrl=${frontUrl}`;
  const link2 = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}?frontUrl=${frontUrl}`;
  const html = getEmailConfirmTemplate({
    confirmEmailLink: link1,
    resendEmailLink: link2
  });


  // const info = await sendEmail({ to: email, subject: "Confirm Email", html, });
  if (!await sendEmail({ to: email, subject: "Confirm Email", html, })) {
    return next(new Error("Rejected Emal", { cause: 400 }))
  }

  return res.status(200).send("<p>Done please cheack your email.</p>")
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("Email not exist", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error('Please confirm your email first', { cause: 400 }));
  }

  // compare hashed Password
  const match = compare({ plainText: password, hashValue: user.password });
  if (!match) {
    return next(new Error("In-valid password", { cause: 404 }));
  }

  // geţ tokens
  const access_token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
      role: user.role,
    },
    expiresIn: 60 * 30,
  });

  const refresh_token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
      role: user.role,
    },
    expiresIn: 60 * 60 * 24 * 365,
  });
  user.status = "online";
  await user.save();
  return res.status(200).json({ message: "Done", access_token, refresh_token });
});

export const loginWithGmail = asyncHandler(async (req, res, next) => {

  const { idToken } = req.body;
  const client = new OAuth2Client(process.env.CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email, email_verified, name, given_name, family_name, picture } = await verify();

  if (!email_verified) {
    return next(new Error("In-valid email", { cause: 400 }));
  }

  const user = await userModel.findOne({ email: email.toLowerCase() });

  //login
  if (user) {
    // login
    if (user.provider != 'GOOGLE') {
      return next(new Error(`In-valid provider, true provider is ${user.provider}`, { cause: 400 }));
    }

    // geţ tokens
    const access_token = generateToken({
      payload: {
        id: user._id,
        isLoggedIn: true,
        role: user.role,
      },
      expiresIn: 60 * 30,
    });

    const refresh_token = generateToken({
      payload: {
        id: user._id,
        isLoggedIn: true,
        role: user.role,
      },
      expiresIn: 60 * 60 * 24 * 365,
    });
    user.status = "online";
    await user.save();
    return res.status(200).json({ message: "Done", access_token, refresh_token });
  }


  // signup

  const customPassword = customAlphabet('0123456789qwertyuiopasdfghjklzxcvbnm', 9);
  const hashPassword = hash({ plainText: customPassword() });

  const newUser = await userModel.create({ 
    firstName: given_name, 
    lastName: family_name, 
    userName: name, 
    email,
    password: hashPassword,
    image: { secure_url: picture },
    confirmEmail: true,
    provider: 'GOOGLE',
    status: 'online',
  });

  // geţ tokens
  const access_token = generateToken({
    payload: {
      id: newUser._id,
      isLoggedIn: true,
      role: newUser.role,
    },
    expiresIn: 60 * 30,
  });

  const refresh_token = generateToken({
    payload: {
      id: newUser._id,
      isLoggedIn: true,
      role: newUser.role,
    },
    expiresIn: 60 * 60 * 24 * 365,
  });

  return res.status(201).json({ message: "Done", access_token, refresh_token });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  let { email } = req.body;
  email = email.toLowerCase();
  const nanoCode = customAlphabet('123456789', 4);
  const user = await userModel.findOneAndUpdate({ email }, { forgetCode: nanoCode() }, { new: true });

  if (!user) {
    next(new Error('Not register account', { cause: 404 }))
  }
  
  const html = getEmailForgetPasswordTemplate({ forgetCode: user.forgetCode })

  if (!await sendEmail({ to: email, subject: "Forget Password", html })) {
    return next(new Error("Rejected Emal", { cause: 400 }))
  }

  return res.status(200).json({ message: "Done" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error('Not register account', { cause: 404 }));
  }
  if (user.forgetCode != forgetCode) {
    return next(new Error('In-valid reset code', { cause: 404 }));
  }
  user.password = hash({ plainText: password });
  user.forgetCode = null;
  user.changePasswordTime = Date.now();
  await user.save();
  return res.status(200).json({ message: "Done" });
});



