const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const typeDefs = require('../src/graphql/schema/typeDefs');
const resolvers = require('../src/graphql/resolvers');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    
    console.log('MongoDB connected successfully');
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context }) => {
    try {
      await connectToDatabase();
      return {
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
      };
    } catch (error) {
      console.error('Context creation error:', error);
      throw error;
    }
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      path: error.path,
      extensions: error.extensions
    };
  },
  playground: true,
  introspection: true
});

exports.handler = async (event, context) => {
  try {
    const handler = server.createHandler({
      cors: {
        origin: '*',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['POST', 'GET', 'OPTIONS'],
      },
    });

    return await handler(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: [{
          message: 'Internal server error',
          details: error.message
        }]
      })
    };
  }
}; 