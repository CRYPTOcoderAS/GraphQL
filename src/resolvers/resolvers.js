const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ObjectId } = require('mongoose').Types;

const resolvers = {
  Query: {
    getCustomerSpending: async (_, { customerId }) => {
      const customerOrders = await Order.aggregate([
        {
          $match: {
            customerId: new ObjectId(customerId)
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
        throw new Error('Customer not found or has no orders');
      }

      return {
        customerId,
        totalSpent: customerOrders[0].totalSpent,
        averageOrderValue: customerOrders[0].averageOrderValue,
        lastOrderDate: customerOrders[0].lastOrderDate.toISOString()
      };
    },

    getTopSellingProducts: async (_, { limit }) => {
      const topProducts = await Order.aggregate([
        { $unwind: '$products' },
        {
          $group: {
            _id: '$products.productId',
            totalSold: { $sum: '$products.quantity' }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            productId: '$_id',
            name: '$product.name',
            totalSold: 1
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit }
      ]);

      return topProducts;
    },

    getSalesAnalytics: async (_, { startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const analytics = await Order.aggregate([
        {
          $match: {
            orderDate: { $gte: start, $lte: end },
            status: 'completed'
          }
        },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: '$totalAmount' },
                  completedOrders: { $sum: 1 }
                }
              }
            ],
            categoryBreakdown: [
              { $unwind: '$products' },
              {
                $lookup: {
                  from: 'products',
                  localField: 'products.productId',
                  foreignField: '_id',
                  as: 'product'
                }
              },
              { $unwind: '$product' },
              {
                $group: {
                  _id: '$product.category',
                  revenue: {
                    $sum: { $multiply: ['$products.quantity', '$products.priceAtPurchase'] }
                  }
                }
              },
              {
                $project: {
                  category: '$_id',
                  revenue: 1,
                  _id: 0
                }
              }
            ]
          }
        }
      ]);

      const result = analytics[0];
      return {
        totalRevenue: result.totals[0]?.totalRevenue || 0,
        completedOrders: result.totals[0]?.completedOrders || 0,
        categoryBreakdown: result.categoryBreakdown
      };
    }
  }
};

module.exports = resolvers; 