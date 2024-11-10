import * as orderController from './fields.js'

const orderSchema = {
    query: {
        orders: orderController.orders,
    },
    mutation: {
    }
};


export default orderSchema;