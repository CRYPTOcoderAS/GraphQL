const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: String,
  category: String,
  price: Number,
  stock: Number
});

// Indexes for faster lookups and aggregations
productSchema.index({ category: 1 });
productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema); 