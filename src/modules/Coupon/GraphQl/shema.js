import * as couponController from './fields.js'

const couponSchema = {
    query: {
        coupons: couponController.coupons,
        getCouponById: couponController.getCouponById,
    },
    mutation: {
        updateCoupon: couponController.updateCoupon,
    }
};


export default couponSchema;