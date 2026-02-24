const express = require('express');
const mongoose = require('mongoose');
const NoSQL = require('./controllers/NoSQLcontroller');
const SQL = require('./controllers/SQLcontroller');

const app = express();
app.use(express.json());

// connect to MongoDB (adjust URI via MONGO_URI env var)
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// NoSQL routes
app.post('/nosql/products', NoSQL.createProduct);
app.get('/nosql/products', NoSQL.getProducts);
app.get('/nosql/products/:id', NoSQL.getProductById);
app.put('/nosql/products/:id', NoSQL.updateProduct);
app.delete('/nosql/products/:id', NoSQL.deleteProduct);

// SQL routes
app.post('/sql/products', SQL.createProduct);
app.get('/sql/products', SQL.getProducts);
app.get('/sql/products/:id', SQL.getProductById);
app.put('/sql/products/:id', SQL.updateProduct);
app.delete('/sql/products/:id', SQL.deleteProduct);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
