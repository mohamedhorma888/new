const Product = require('../models/Product');

// handlers for Express routes using Mongoose

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;
    const product = new Product({ name, price, category, inStock });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating product (MongoDB)', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products (MongoDB)', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product by id (MongoDB)', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('Error updating product (MongoDB)', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', id });
  } catch (err) {
    console.error('Error deleting product (MongoDB)', err);
    res.status(400).json({ error: err.message });
  }
};
