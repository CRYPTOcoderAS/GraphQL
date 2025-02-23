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
  }
}; 