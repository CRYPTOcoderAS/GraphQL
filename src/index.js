require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const schema = require('./graphql/schema');
const Redis = require('ioredis');

// Initialize Redis client for caching
const redis = new Redis(process.env.REDIS_URL);

async function startServer() {
  const app = express();

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: { redis },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        status: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
      };
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(console.error); 