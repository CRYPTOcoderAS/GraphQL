const orderService = require('../../services/orderService');

module.exports = {
  Query: {
    getSalesAnalytics: (_, { startDate, endDate }) => 
      orderService.getSalesAnalytics(startDate, endDate)
  }
}; 