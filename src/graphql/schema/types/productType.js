const { gql } = require('apollo-server-express');

module.exports = gql`
  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  extend type Query {
    getTopSellingProducts(limit: Int!): [TopProduct]
  }
`; 