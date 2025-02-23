const { makeExecutableSchema } = require('@graphql-tools/schema');
const { gql } = require('apollo-server-express');
const customerType = require('./types/customerType');
const orderType = require('./types/orderType');
const productType = require('./types/productType');
const resolvers = require('../resolvers');

const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, customerType, orderType, productType],
  resolvers
});

module.exports = schema; 