// Part 1: Initial NoSQL Database Design for E-Commerce Application
// Using MongoDB (Document-based NoSQL model) for flexibility, scalability, and support for complex queries.

// Key Entities:
// - Users: Customer information
// - Products: Product catalog with details for browsing and search
// - Orders: Transaction data with customer info, items, and status

// Schema Design Principles:
// - Embed data accessed together to reduce lookups and enable atomic operations.
// - Reference when relationships are many-to-many or data grows unbounded.
// - Use indexes for query patterns: product search, order lookups by user.
// - Support high write throughput for orders with sharding considerations.

// Collections:

// 1. Users Collection
// Stores user profiles. Orders are referenced to avoid large embedded arrays.
const userSchema = {
  _id: ObjectId, // Auto-generated
  email: String, // Unique index for login
  name: String,
  address: {
    street: String,
    city: String,
    zip: String,
    country: String
  },
  createdAt: Date,
  // Reference to orders for user's order history
  orderIds: [ObjectId] // Array of order IDs, can grow but typically bounded
};

// Indexes:
// - { email: 1 } (unique)
// - { _id: 1, orderIds: 1 } for fetching user's orders

// 2. Products Collection
// Stores product details. Supports browsing and full-text search.
const productSchema = {
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  tags: [String], // For search
  images: [String], // URLs
  createdAt: Date,
  updatedAt: Date
};

// Indexes:
// - { category: 1, price: 1 } for browsing by category and price
// - Text index: { name: "text", description: "text", tags: "text" } for full-text search
// - { _id: 1 } default

// 3. Orders Collection
// Stores order details. Embedded line items for atomic updates and fast reads.
// Customer info denormalized for consistency and to avoid lookups during order processing.
const orderSchema = {
  _id: ObjectId,
  userId: ObjectId, // Reference to user
  customer: { // Denormalized for consistency
    name: String,
    email: String,
    address: {
      street: String,
      city: String,
      zip: String,
      country: String
    }
  },
  items: [{ // Embedded array of line items
    productId: ObjectId,
    name: String, // Denormalized for display
    price: Number, // At time of order
    quantity: Number
  }],
  total: Number,
  status: String, // e.g., "pending", "shipped", "delivered"
  createdAt: Date,
  updatedAt: Date,
  deliveryStatus: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  }
};

// Indexes:
// - { userId: 1, createdAt: -1 } for user's order history
// - { status: 1, createdAt: -1 } for order management
// - Compound index on items.productId for analytics if needed

// Scalability and Consistency:
// - Sharding: Shard orders by userId (hash) for even distribution and user-based queries.
// - Replication: Use replica sets for read scaling and failover.
// - Consistency: Strong consistency for order status updates (single document atomicity).
// - Write throughput: Orders are independent documents, no cross-collection transactions needed.

// Part 2: Refactored Design for Analytics and High Availability

// New Requirements:
// - Analytics: Large-scale queries for product trends and sales data.
// - High Availability: Partition tolerance and availability (CAP theorem trade-offs).

// Refactoring Strategies:
// - Sharding: Distribute data across nodes.
// - Replication: Multiple copies for fault tolerance.
// - Denormalization: Pre-aggregated data for fast analytics.

// Updated Schema:

// 1. Users Collection - No major changes, but ensure sharding if needed.

// 2. Products Collection - Add analytics fields.
const productSchemaV2 = {
  ...productSchema,
  salesCount: Number, // Pre-aggregated for trends
  revenue: Number, // Pre-aggregated
  lastSold: Date
};

// Indexes: Add { salesCount: -1 } for top products.

// 3. Orders Collection - No changes, but add sharding.

// New Collection: Analytics Aggregates
// For fast analytics queries, pre-compute aggregations.
const analyticsSchema = {
  _id: ObjectId,
  type: String, // e.g., "daily_sales", "product_trends"
  date: Date,
  data: { // Flexible object for aggregates
    totalSales: Number,
    topProducts: [{ productId: ObjectId, sales: Number }],
    categoryRevenue: { category: String, revenue: Number }
  }
};

// Indexes: { type: 1, date: -1 }

// Sharding Strategy:
// - Orders: Shard by { userId: "hashed" } for even distribution.
// - Products: Shard by { category: "hashed" } if catalog grows large.
// - Analytics: Shard by { date: "hashed" } for time-based queries.

// Replication:
// - Use replica sets with 3+ nodes for HA.
// - Read from secondaries for analytics to offload primary.

// Denormalization Trade-offs:
// - Pros: Faster queries, no real-time aggregation.
// - Cons: Increased storage, update complexity (use change streams or periodic jobs to update aggregates).

// CAP Trade-offs:
// - Prioritize Availability and Partition Tolerance (AP) for e-commerce.
// - Use eventual consistency for analytics data.
// - Strong consistency for order status (CP for critical ops).
