const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const { gql } = require('graphql-tag');

// Import schema as a string
const typeDefs = gql`
  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending!
    getTopSellingProducts(limit: Int!): [ProductSales!]!
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics!
    getOrdersByStatus(status: String!): [Order!]!
    getCustomerOrders(customerId: ID!, page: Int!, limit: Int!): OrdersWithPagination!
  }

  type Mutation {
    placeOrder(input: OrderInput!): Order!
  }

  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String
  }

  type ProductSales {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    canceledOrders: Int!
    pendingOrders: Int!
    averageOrderValue: Float!
    categoryBreakdown: [CategoryBreakdown!]!
  }

  type CategoryBreakdown {
    category: String!
    revenue: Float!
    count: Int!
  }

  type Order {
    _id: ID!
    customerId: ID!
    products: [OrderProduct!]!
    totalAmount: Float!
    orderDate: String!
    status: String!
  }

  type OrderProduct {
    productId: ID!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type OrdersWithPagination {
    orders: [Order!]!
    pagination: PaginationInfo!
  }

  type PaginationInfo {
    total: Int!
    page: Int!
    pages: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  input OrderInput {
    customerId: ID!
    products: [OrderProductInput!]!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }
`;

// Import resolvers
const resolvers = require('../src/resolvers/resolvers');

// Connect to MongoDB
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const { MONGODB_URI } = process.env;
  
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    );
  }

  const db = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;
  return db;
}

let apolloServer = null;

exports.handler = async function (event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Create Apollo Server if it doesn't exist
    if (!apolloServer) {
      apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: async () => {
          const db = await connectToDatabase();
          return { db };
        },
        playground: true,
        introspection: true
      });
    }

    const handler = apolloServer.createHandler();
    
    // Add CORS headers to the response
    const response = await new Promise((resolve, reject) => {
      handler(event, context, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    return {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    };
  } catch (error) {
    console.error('GraphQL Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
