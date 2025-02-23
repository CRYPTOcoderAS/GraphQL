const customerService = require('../../services/customerService');

module.exports = {
  Query: {
    getCustomerSpending: (_, { customerId }) => customerService.getCustomerSpending(customerId)
  }
}; 