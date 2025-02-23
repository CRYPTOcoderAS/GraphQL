const Order = require('../models/order.model');
const redisService = require('./redis.service');

class AnalyticsService {
  async getCustomerSpending(customerId) {
    const cacheKey = redisService.generateKey('customer-spending', { customerId });
    const cachedData = await redisService.get(cacheKey);
    
    if (cachedData) return cachedData;

    const orders = await Order.find({ customerId, status: 'completed' });
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalSpent / (orders.length || 1);
    const lastOrderDate = orders.length ? orders[orders.length - 1].orderDate : null;

    const result = {
      customerId,
      totalSpent,
      averageOrderValue,
      lastOrderDate
    };

    await redisService.set(cacheKey, result);
    return result;
  }

  async getTopSellingProducts(limit) {
    const cacheKey = redisService.generateKey('top-products', { limit });
    const cachedData = await redisService.get(cacheKey);
    
    if (cachedData) return cachedData;

    const result = await Order.aggregate([
      { $unwind: '$products' },
      { $group: {
        _id: '$products.productId',
        totalSold: { $sum: '$products.quantity' }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }},
      { $project: {
        productId: '$_id',
        name: { $arrayElemAt: ['$product.name', 0] },
        totalSold: 1
      }}
    ]);

    await redisService.set(cacheKey, result);
    return result;
  }

  async getSalesAnalytics(startDate, endDate) {
    const cacheKey = redisService.generateKey('sales-analytics', { startDate, endDate });
    const cachedData = await redisService.get(cacheKey);
    
    if (cachedData) return cachedData;

    const orders = await Order.find({
      orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    const result = {
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      completedOrders: orders.filter(o => o.status === 'completed').length,
      canceledOrders: orders.filter(o => o.status === 'canceled').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      averageOrderValue: orders.reduce((sum, order) => sum + order.totalAmount, 0) / (orders.length || 1),
      categoryBreakdown: await this.getCategoryBreakdown(orders)
    };

    await redisService.set(cacheKey, result);
    return result;
  }

  async getCategoryBreakdown(orders) {
    const breakdown = {};
    for (const order of orders) {
      for (const product of order.products) {
        const productDetails = await Product.findById(product.productId);
        const category = productDetails.category;
        
        if (!breakdown[category]) {
          breakdown[category] = { revenue: 0, count: 0 };
        }
        
        breakdown[category].revenue += product.quantity * product.priceAtPurchase;
        breakdown[category].count += product.quantity;
      }
    }

    return Object.entries(breakdown).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      count: data.count
    }));
  }
}

module.exports = new AnalyticsService();
