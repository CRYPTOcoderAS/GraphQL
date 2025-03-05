const { gql } = require('apollo-server-express');

module.exports = gql`
  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String!
    name: String!
  }

  extend type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
  }
`; 