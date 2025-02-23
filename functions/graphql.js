const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const resolvers = require('../src/resolvers/resolvers');

// Read the schema
const typeDefs = readFileSync(resolve(__dirname, '../src/schema/schema.graphql'), {
  encoding: 'utf-8'
});

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    await connectToDatabase();
    return {};
  },
  playground: true,
  introspection: true
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
