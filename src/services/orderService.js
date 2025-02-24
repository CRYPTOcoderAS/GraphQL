const Order = require('../models/Order');
const Product = require('../models/Product');
const redisService = require('./redis.service');

class OrderService {
  async getCustomerOrders(customerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      Order.find({ customerId })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('products.productId'),
      Order.countDocuments({ customerId })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      orders,
      pagination: {
        total,
        page,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async getOrdersByStatus(status) {
    const cacheKey = redisService.generateKey('orders-by-status', { status });
    const cachedData = await redisService.get(cacheKey);
    
    if (cachedData) return cachedData;

    const orders = await Order.find({ status })
      .populate('products.productId')
      .sort({ orderDate: -1 });

    await redisService.set(cacheKey, orders);
    return orders;
  }

  async placeOrder(input) {
    try {
      console.log('Processing order input:', JSON.stringify(input, null, 2));
      
      // First, let's create the product if it doesn't exist
      for (const item of input.products) {
        console.log('Finding product:', item.productId);
        let product = await Product.findById(item.productId).exec();
        
        if (!product) {
          console.log('Product not found, creating new product:', item.productId);
          product = new Product({
            _id: item.productId,
            name: 'Auto-created Product',
            price: item.price,
            category: 'Auto-created',
            stock: 100
          });
          await product.save();
          console.log('Created new product:', product);
        }
      }

      // Now calculate total and create order
      let totalAmount = 0;
      const productsWithPrice = [];

      for (const item of input.products) {
        const product = await Product.findById(item.productId).exec();
        console.log('Using product:', product);

        const priceAtPurchase = item.price || product.price;
        totalAmount += priceAtPurchase * item.quantity;

        productsWithPrice.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase
        });
      }

      console.log('Creating order with:', {
        customerId: input.customerId,
        products: productsWithPrice,
        totalAmount
      });

      // Create and save the order
      const order = new Order({
        customerId: input.customerId,
        products: productsWithPrice,
        totalAmount,
        orderDate: new Date(),
        status: 'pending'
      });

      const savedOrder = await order.save();
      console.log('Saved order:', savedOrder);
      
      // Populate the products for the response
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate('products.productId')
        .exec();
      console.log('Populated order:', populatedOrder);

      // Invalidate relevant caches
      await redisService.del(redisService.generateKey('orders-by-status', { status: 'pending' }));
      await redisService.del(redisService.generateKey('customer-spending', { customerId: input.customerId }));

      return populatedOrder;
    } catch (error) {
      console.error('Error in placeOrder:', error);
      throw error;
    }
  }

  async getSalesAnalytics(startDate, endDate) {
    const cacheKey = redisService.generateKey('sales-analytics', { startDate, endDate });
    const cachedData = await redisService.get(cacheKey);
    
    if (cachedData) return cachedData;

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

    const response = {
      totalRevenue: totals.totalRevenue,
      completedOrders: totals.completedOrders,
      canceledOrders: totals.canceledOrders,
      pendingOrders: totals.pendingOrders,
      categoryBreakdown: result.categoryBreakdown,
      averageOrderValue: totals.totalOrders ? totals.totalRevenue / totals.totalOrders : 0
    };

    await redisService.set(cacheKey, response);
    return response;
  }

  async getOrdersByStatus(status) {
    const cacheKey = this.cacheService.generateKey('orders_by_status', { status });
    
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const orders = await Order.find({ status });
    
    await this.cacheService.set(cacheKey, orders);
    return orders;
  }
}

module.exports = OrderService; 