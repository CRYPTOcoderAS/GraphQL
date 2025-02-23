const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderProductSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must have at least one product']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for faster lookups and aggregations
orderSchema.index({ customerId: 1 });
orderSchema.index({ orderDate: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });

// Virtual for order age
orderSchema.virtual('age').get(function() {
  return Date.now() - this.orderDate.getTime();
});

// Method to calculate total amount
orderSchema.methods.calculateTotal = function() {
  return this.products.reduce((total, product) => {
    return total + (product.quantity * product.priceAtPurchase);
  }, 0);
};

module.exports = mongoose.model('Order', orderSchema); 