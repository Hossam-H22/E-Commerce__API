import * as brandController from './fields.js'

const brandSchema = {
    query: {
        brands: brandController.brands,
        getBrandById: brandController.getBrandById,
    },
    mutation: {
        updateBrand: brandController.updateBrand,
    }
};


export default brandSchema;