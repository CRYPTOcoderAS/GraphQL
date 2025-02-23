const productService = require('../../services/productService');

module.exports = {
  Query: {
    getTopSellingProducts: (_, { limit }) => productService.getTopSellingProducts(limit)
  }
}; 