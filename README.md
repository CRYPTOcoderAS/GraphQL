# Delightree Analytics API

A GraphQL API for sales analytics built with Node.js, Apollo Server, MongoDB, and Redis caching.

## Features

- Customer spending analytics
- Top selling products analysis
- Sales analytics with date range filtering
- Order management with status tracking
- Pagination support for customer orders
- Redis caching for optimized performance

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- Redis (for caching)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/CRYPTOcoderAS/GraphQL.git
   
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   PORT=4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm run build
   npm start
   ```

## API Documentation

The API includes the following main queries and mutations:

### Queries

- `getCustomerSpending`: Get customer spending analytics
- `getTopSellingProducts`: Get top-selling products
- `getSalesAnalytics`: Get sales analytics within a date range
- `getOrdersByStatus`: Get orders filtered by status
- `getCustomerOrders`: Get paginated customer orders

### Mutations

- `placeOrder`: Create a new order

Detailed query examples can be found in the `queries.graphql` file.

## Testing

Run the test suite:
```bash
npm test
```

## Data Seeding

To populate the database with sample data:
```bash
npm run seed
```

## Performance Optimizations

- Redis caching implemented for analytics queries
- Pagination support for large data sets
- MongoDB indexes for optimized queries

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Deployment

### Deploying to Netlify

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/CRYPTOcoderAS/GraphQL.git
   cd GraphQL
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Configure the following build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Functions directory: `functions`

4. Set up environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment variables
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     REDIS_URL=your_redis_connection_string
     ```

5. Your API will be available at:
   ```
   https://your-site-name.netlify.app/.netlify/functions/graphql
   ```

### Testing the Deployed API

You can test your API using the GraphQL Playground at:
```
https://your-site-name.netlify.app/.netlify/functions/graphql
```

Example query:
```graphql
query {
  getTopSellingProducts(limit: 5) {
    productId
    name
    totalSold
  }
}
```

## License

MIT
