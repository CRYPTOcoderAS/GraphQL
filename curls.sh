# 1. Get Customer Spending
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetCustomerSpending($customerId: ID!) { getCustomerSpending(customerId: $customerId) { customerId totalSpent averageOrderValue lastOrderDate } }",
    "variables": {
      "customerId": "7895595e-7f25-47fe-a6f8-94b31bfab736"
    }
  }'

# 2. Get Top Selling Products
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetTopSellingProducts($limit: Int!) { getTopSellingProducts(limit: $limit) { productId name totalSold } }",
    "variables": {
      "limit": 5
    }
  }'

# 3. Get Sales Analytics
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

# 4. Get Orders By Status
curl -X POST \
  http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetOrdersByStatus($status: String!) { getOrdersByStatus(status: $status) { _id customerId products { productId quantity priceAtPurchase } totalAmount orderDate status } }",
    "variables": {
      "status": "completed"
    }
  }' 