require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const data = require('./data');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Customer.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert new data with logging
    const customers = await Customer.insertMany(data.customers);
    console.log(`Inserted ${customers.length} customers`);
    
    const products = await Product.insertMany(data.products);
    console.log(`Inserted ${products.length} products`);
    
    const orders = await Order.insertMany(data.orders);
    console.log(`Inserted ${orders.length} orders`);

    // Verify data
    const customerCount = await Customer.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log('\nVerification:');
    console.log(`Customers in DB: ${customerCount}`);
    console.log(`Products in DB: ${productCount}`);
    console.log(`Orders in DB: ${orderCount}`);

    // Check specific customer
    const customer = await Customer.findById("7895595e-7f25-47fe-a6f8-94b31bfab736");
    console.log('\nLooking for customer:', "7895595e-7f25-47fe-a6f8-94b31bfab736");
    console.log('Customer found:', customer ? 'Yes' : 'No');

    const customerOrders = await Order.find({ 
      customerId: "7895595e-7f25-47fe-a6f8-94b31bfab736" 
    });
    console.log('Orders for customer:', customerOrders.length);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 