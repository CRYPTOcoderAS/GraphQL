const Order = require('../models/Order');

class ProductService {
  async getTopSellingProducts(limit) {
    return Order.aggregate([
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
  }
}

module.exports = new ProductService(); 