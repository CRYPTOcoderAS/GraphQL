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



## Example API Requests

Below are example curl commands to interact with the API endpoints:

### 1. Get Customer Spending
Retrieve spending analytics for a specific customer.
```bash
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetCustomerSpending($customerId: ID!) { getCustomerSpending(customerId: $customerId) { customerId totalSpent averageOrderValue lastOrderDate } }",
    "variables": {
      "customerId": "7895595e-7f25-47fe-a6f8-94b31bfab736"
    }
  }'
```

### 2. Get Top Selling Products
Get a list of top-selling products with customizable limit.
```bash
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetTopSellingProducts($limit: Int!) { getTopSellingProducts(limit: $limit) { productId name totalSold } }",
    "variables": {
      "limit": 5
    }
  }'
```

### 3. Get Sales Analytics
Retrieve comprehensive sales analytics for a specific date range.
```bash
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetSalesAnalytics($startDate: String!, $endDate: String!) { getSalesAnalytics(startDate: $startDate, endDate: $endDate) { totalRevenue completedOrders canceledOrders pendingOrders averageOrderValue categoryBreakdown { category revenue count } } }",
    "variables": {
      "startDate": "2024-01-01",
      "endDate": "2025-02-28"
    }
  }'
```

### 4. Get Orders By Status
Fetch orders filtered by their current status.
```bash
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetOrdersByStatus($status: String!) { getOrdersByStatus(status: $status) { _id customerId products { productId quantity priceAtPurchase } totalAmount orderDate status } }",
    "variables": {
      "status": "completed"
    }
  }'
```


