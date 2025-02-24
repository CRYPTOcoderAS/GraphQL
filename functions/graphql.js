const { ApolloServer } = require('@apollo/server');
const { startServerAndCreateLambdaHandler, handlers } = require('@as-integrations/aws-lambda');
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
  introspection: true,
});

exports.handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event, context }) => {
      await connectToDatabase();
      return {
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
      };
    },
  }
); 