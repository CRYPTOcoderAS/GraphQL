const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: String,
  email: String,
  age: Number,
  location: String,
  gender: String
});

// Index for faster lookups
customerSchema.index({ email: 1 });

module.exports = mongoose.model('Customer', customerSchema); 