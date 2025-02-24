const { gql } = require('apollo-server-express');

module.exports = gql`
  type OrderProduct {
    productId: ID!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type Order {
    _id: ID!
    customerId: ID!
    products: [OrderProduct!]!
    totalAmount: Float!
    orderDate: String!
    status: String!
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
    categoryBreakdown: [CategoryBreakdown!]!
    averageOrderValue: Float!
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

  extend type Query {
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    getOrdersByStatus(status: String!): [Order!]!
  }

  extend type Mutation {
    placeOrder(input: OrderInput!): Order!
  }
`; 