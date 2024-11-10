import * as productController from "./fields.js";


const productSchema = {
    query: {
        products: productController.products,
        getProductById: productController.getProductById,
    },
    mutation: {
        updateProduct: productController.updateProduct,
        addToWishlist: productController.addToWishlist,
        removeFromWishlist: productController.removeFromWishlist,
    }
};


export default productSchema;