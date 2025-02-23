const Order = require('../models/Order');

class OrderService {
  async getSalesAnalytics(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const analytics = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end }
        }
      },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                completedOrders: {
                  $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                canceledOrders: {
                  $sum: { $cond: [{ $eq: ['$status', 'canceled'] }, 1, 0] }
                },
                pendingOrders: {
                  $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                },
                totalOrders: { $sum: 1 }
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
                },
                count: { $sum: '$products.quantity' }
              }
            },
            {
              $project: {
                category: '$_id',
                revenue: 1,
                count: 1,
                _id: 0
              }
            }
          ]
        }
      }
    ]);

    const result = analytics[0];
    const totals = result.totals[0] || {
      totalRevenue: 0,
      completedOrders: 0,
      canceledOrders: 0,
      pendingOrders: 0,
      totalOrders: 0
    };

    return {
      totalRevenue: totals.totalRevenue,
      completedOrders: totals.completedOrders,
      canceledOrders: totals.canceledOrders,
      pendingOrders: totals.pendingOrders,
      categoryBreakdown: result.categoryBreakdown,
      averageOrderValue: totals.totalOrders ? totals.totalRevenue / totals.totalOrders : 0
    };
  }

  async getOrdersByStatus(status) {
    return Order.find({ status });
  }
}

module.exports = new OrderService(); 