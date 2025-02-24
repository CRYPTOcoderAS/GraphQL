const customerService = require('../../services/customerService');
const productService = require('../../services/productService');
const OrderService = require('../../services/orderService');

const resolvers = {
  Query: {
    getCustomerSpending: (_, { customerId }) => 
      customerService.getCustomerSpending(customerId),
    
    getTopSellingProducts: (_, { limit }) => 
      productService.getTopSellingProducts(limit),
    
    getSalesAnalytics: async (_, { startDate, endDate }) => {
      const orderService = new OrderService();
      return orderService.getSalesAnalytics(startDate, endDate);
    },
    
    getOrdersByStatus: async (_, { status }) => {
      const orderService = new OrderService();
      return orderService.getOrdersByStatus(status);
    }
  }
};

module.exports = resolvers; 