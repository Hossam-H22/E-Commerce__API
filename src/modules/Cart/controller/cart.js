
import { asyncHandler } from './../../../utils/errorHandling.js';
import productModel from './../../../../DB/Models/Product.model.js';
import cartModel from './../../../../DB/Models/Cart.model.js';



export const getCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        return next(new Error('Not found cart', { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", cart });
});


export const createCart = asyncHandler(async (req, res, next) => {

    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // check Product availability
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new Error(`In-valied product Id`, { cause: 404 }));
    }
    if (product.stock < quantity || product.isDeleted) {
        await productModel.updateOne({ _id: productId }, { $addToSet: { wishUserList: { userId, quantity } } });
        return next(new Error(`This product doesn't have enough quantity in stock`, { cause: 400 }));
    }

    // check cart exist
    const cart = await cartModel.findOne({ userId });
    // if not exist create new one
    if (!cart) {
        const newCart = await cartModel.create({
            userId,
            products: [{ productId, quantity }],
        });
        return res.status(201).json({ message: "Done", cart: newCart });
    }

    // if exist 2 options

    //1- update old item   
    let matchProduct = false;
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity;
            matchProduct = true;
            break;
        }
    }

    // 2- push new item
    if (!matchProduct) {
        cart.products.push({ productId, quantity });
    }


    await cart.save();
    return res.status(200).json({ message: "Done", cart: cart });
});


export async function deleteItemsFromCart(userId, productIds) {
    const cart = await cartModel.updateOne({ userId }, {
        $pull: {
            products: {
                productId: { $in: productIds }
            }
        }
    }, { new: true });
    return cart;
}


export const deleteItems = asyncHandler(async (req, res, next) => {
    const { productIds } = req.body;
    const cart = await deleteItemsFromCart(req.user._id, productIds);
    if (!cart?.modifiedCount) {
        return next(new Error('Not found cart', { cause: 404 }))
    }
    return res.status(200).json({ message: "Done" });
});


export async function emptyCart(userId) {
    const cart = await cartModel.updateOne({ userId }, { products: [] });
    return cart;
}

export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await emptyCart(req.user._id);
    if (!cart?.modifiedCount) {
        return next(new Error('Not found cart', { cause: 404 }))
    }
    return res.status(200).json({ message: "Done" });
});