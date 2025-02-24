const OrderService = require('../../services/orderService');

module.exports = {
  Query: {
    getSalesAnalytics: async (_, { startDate, endDate }, { redis }) => {
      const orderService = new OrderService(redis);
      return orderService.getSalesAnalytics(startDate, endDate);
    },
    getOrdersByStatus: async (_, { status }, { redis }) => {
      const orderService = new OrderService(redis);
      return orderService.getOrdersByStatus(status);
    }
  },
  Mutation: {
    placeOrder: async (_, { input }, { redis }) => {
      try {
        console.log('Received order input:', JSON.stringify(input, null, 2));
        const orderService = new OrderService(redis);
        const result = await orderService.placeOrder(input);
        console.log('Order created successfully:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('Error in placeOrder resolver:', error);
        throw error;
      }
    }
  }
}; 