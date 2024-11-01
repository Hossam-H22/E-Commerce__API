import * as productController from "./fields.js";


const productSchema = {
    query: {
        products: productController.products,
        getProductById: productController.getProductById,
    },
    mutation: {
        updateStock: productController.updateStock,
    }
};


export default productSchema;