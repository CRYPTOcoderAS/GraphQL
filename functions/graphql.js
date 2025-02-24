const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const typeDefs = require('../src/graphql/schema/typeDefs');
const resolvers = require('../src/graphql/resolvers');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    console.log('Connecting to MongoDB...');
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB');
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context }) => {
    try {
      await connectToDatabase();
      console.log('Database connected, setting up context');
      return {
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
      };
    } catch (error) {
      console.error('Error in context setup:', error);
      throw error;
    }
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
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