
import { asyncHandler } from './../../../utils/errorHandling.js';
import couponModel from './../../../../DB/Models/Coupon.model.js';
import productModel from './../../../../DB/Models/Product.model.js';
import orderModel from './../../../../DB/Models/Order.model.js';
import cartModel from './../../../../DB/Models/Cart.model.js';
import { deleteItemsFromCart, emptyCart } from '../../Cart/controller/cart.js';
import { createInvoice } from './../../../utils/pdf.js';
import sendEmail from './../../../utils/sendEmail.js';
import payment from './../../../utils/payment.js';
import Stripe from 'stripe';





export const getOrders = asyncHandler(async (req, res, next) => {
    const order = await orderModel.find({ userId: req.user._id });
    if (!order) {
        return next(new Error('Not found orders', { cause: 404 }))
    }

    return res.status(200).json({ message: "Done", order });
});


export const createOrder = asyncHandler(async (req, res, next) => {
    let { products, address, phone, note, couponName, paymentType, } = req.body;
    const { cancel_url, success_url } = req.query;

    if (!products?.length) {
        const cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart?.products?.length) {
            return next(new Error(`Empty cart`, { cause: 400 }));
        }
        products = cart.products;
        req.body.isCart = true;
    }

    // check if coupon exist
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } });
        if (!coupon || coupon.expireDate.getTime() < Date.now()) {
            return next(new Error(`In-valied or expired coupon`, { cause: 400 }));
        }
        req.body.coupon = coupon;
    }

    const productIds = [];
    const finalProductList = [];
    let subtotal = 0;
    for (let product of products) {
        const checkedProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false,
        });

        if (!checkedProduct) {
            return next(new Error(`In-valid or unavailable product with id ${product.productId}`, { cause: 400 }));
        }
        if (req.body.isCart) product = product.toObject();
        productIds.push(product.productId);
        product.name = checkedProduct.name;
        product.unitPrice = checkedProduct.finalPrice;
        product.finalPrice = Number.parseFloat((product.quantity * product.unitPrice).toFixed(2));
        subtotal += Number.parseFloat(product.finalPrice);
        finalProductList.push(product);
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phone,
        note,
        products: finalProductList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: Number.parseFloat((subtotal * ((100 - (req.body.coupon?.amount || 0)) / 100)).toFixed(2)),
        paymentType,
        status: paymentType == 'card' ? 'waitPayment' : 'placed',
    });

    if (!order) {
        return next(new Error(`Fail to create order`, { cause: 400 }));
    }

    // decreasse product stock
    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, {
            $inc: { stock: -parseInt(product.quantity) },
            $inc: { numOfSoldItems: 1 }
        });
    }

    // push user id in coupon usedBy
    if (req.body.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } });
    }

    // clear items cart
    if (req.body.isCart) {
        await emptyCart(req.user._id);
    }
    else {
        await deleteItemsFromCart(req.user._id, productIds);
    }

    // // generate pdf
    // const invoice = {
    //     shipping: {
    //         name: req.user.userName,
    //         address: order.address,
    //         country: "Egypt",
    //     },
    //     items: order.products,
    //     subtotal: order.subtotal,
    //     total: order.finalPrice,
    //     invoice_nr: order._id,
    //     date: order.createdAt
    // };
    // await createInvoice(invoice, "invoice.pdf");


    // // send email to notify User
    // if (!await sendEmail({
    //     to: req.user.email, subject: "Invoice", attachments: [
    //         {
    //             path: "invoice.pdf",
    //             contentType: 'application/pdf',
    //         },
    //     ]
    // })
    // ) {
    //     return next(new Error("Rejected Emal", { cause: 400 }))
    // }


    // card payment
    if (order.paymentType == 'card') {
        const stripe = new Stripe(process.env.STRIPE_KEY);
        if (req.body.coupon) {
            const coupon = await stripe.coupons.create({ percent_off: req.body.coupon.amount, duration: 'once' });
            req.body.couponId = coupon.id;
        }
        const session = await payment({
            stripe,
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.user.email,
            metadata: {
                orderId: order._id.toString(),
            },
            cancel_url: `${cancel_url || process.env.cancel_url}?orderId=${order._id.toString()}`,
            line_items: order.products.map(product => {
                return {
                    price_data: {
                        currency: 'egp',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.unitPrice * 100, // convert from cent to dollar
                    },
                    quantity: product.quantity,
                }
            }),
            discounts: req.body.couponId ? [{ coupon: req.body.couponId }] : [],
            success_url: `${success_url || process.env.success_url}?orderId=${order._id.toString()}`,
        });

        return res.status(201).json({ message: "Done", order, session, url: session.url });
    }



    return res.status(201).json({ message: "Done", order });
});


export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
        return next(new Error(`In-valid order Id`, { cause: 404 }));
    }
    if ((order?.status != 'placed' && order?.paymentType == 'cash') || (order?.status != 'waitPayment' && order?.paymentType == 'card')) {
        return next(new Error(`Cannot cancel your order after if been changed to ${order?.status}`, { cause: 400 }));
    }

    const canceledPrder = await orderModel.updateOne({ _id: orderId }, { status: 'canceled', reason, updatedBy: req.user._id });
    if (!canceledPrder.matchedCount) {
        return next(new Error(`Fail to cancel your order`, { cause: 400 }));
    }

    // increasse product stock
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, {
            $inc: { stock: parseInt(product.quantity) },
            $inc: { numOfSoldItems: -1 }
        });
    }

    // pull user id in coupon usedBy
    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } });
    }

    return res.status(200).json({ message: "Done" });
});


export const updateOrderStatusByAdmin = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
        return next(new Error(`In-valid order Id`, { cause: 400 }));
    }
    if (order?.status == 'delivered' || (order?.status != 'waitPayment' && order?.paymentType == 'card')) {
        return next(new Error(`Cannot update order status if been changed to ${order?.status}`, { cause: 400 }));
    }

    const canceledPrder = await orderModel.updateOne({ _id: orderId }, { status: status, updatedBy: req.user._id });
    if (!canceledPrder.matchedCount) {
        return next(new Error(`Failed to update order`, { cause: 400 }));
    }

    if (status == 'rejected') {
        // increasse product stock
        for (const product of order.products) {
            await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } });
        }

        // pull user id in coupon usedBy
        if (order.couponId) {
            await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: order.userId } });
        }
    }

    return res.status(200).json({ message: "Done" });
});

export const webhook = asyncHandler(async (req, res) => {

    const stripe = new Stripe(process.env.STRIPE_KEY);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.END_POINT_SECRET_WEBHOOK);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const { orderId } = event.data.object.metadata
    if(event.type != 'checkout.session.completed'){
        await orderModel.updateOne({ _id: orderId }, { status: 'rejected' });
        res.status(400).json({ message: "Rejected order" });
    }
    
    await orderModel.updateOne({ _id: orderId }, { status: 'placed' });
    res.status(200).json({ message: "Done" });
});