const Customer = require('../models/Customer');
const Order = require('../models/Order');

class CustomerService {
  async getCustomerSpending(customerId) {
    // First verify the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    // Get customer orders
    const customerOrders = await Order.aggregate([
      {
        $match: {
          customerId: customerId
        }
      },
      {
        $group: {
          _id: '$customerId',
          totalSpent: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          lastOrderDate: { $max: '$orderDate' }
        }
      }
    ]);

    if (customerOrders.length === 0) {
      return {
        customerId,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null
      };
    }

    return {
      customerId,
      totalSpent: customerOrders[0].totalSpent,
      averageOrderValue: customerOrders[0].averageOrderValue,
      lastOrderDate: customerOrders[0].lastOrderDate.toISOString()
    };
  }
}

module.exports = new CustomerService(); 