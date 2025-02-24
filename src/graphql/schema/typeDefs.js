const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String!
  }

  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  type CategoryBreakdown {
    category: String!
    revenue: Float!
    count: Int!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    canceledOrders: Int!
    pendingOrders: Int!
    averageOrderValue: Float!
    categoryBreakdown: [CategoryBreakdown!]!
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

  input OrderProductInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  input OrderInput {
    customerId: ID!
    products: [OrderProductInput!]!
  }

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    getOrdersByStatus(status: String!): [Order!]!
  }

  type Mutation {
    placeOrder(input: OrderInput!): Order!
  }
`;

module.exports = typeDefs; 