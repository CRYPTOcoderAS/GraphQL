const { gql } = require('apollo-server-express');
const customerType = require('./types/customerType');
const productType = require('./types/productType');
const orderType = require('./types/orderType');

const baseSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

module.exports = [baseSchema, customerType, productType, orderType]; 