const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const typeDefs = require('../src/graphql/schema/typeDefs');
const resolvers = require('../src/graphql/resolvers');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
    await connectToDatabase();
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    };
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