const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    ref: 'Customer'
  },
  products: [{
    productId: {
      type: String,
      ref: 'Product'
    },
    quantity: Number,
    priceAtPurchase: Number
  }],
  totalAmount: Number,
  orderDate: Date,
  status: String
});

// Indexes for faster lookups and aggregations
orderSchema.index({ customerId: 1 });
orderSchema.index({ orderDate: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema); 