const pool = require('../db/mysql');

// parameterized SQL CRUD operations

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category = null, inStock = true } = req.body;
    const [result] = await pool.query(
      `INSERT INTO products (name, price, category, inStock) VALUES (?, ?, ?, ?)`,
      [name, price, category, inStock ? 1 : 0]
    );

    const insertId = result.insertId;
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating product (MySQL)', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM products`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products (MySQL)', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching product by id (MySQL)', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const fields = [];
    const values = [];

    // build SET clause dynamically
    for (const key of ['name', 'price', 'category', 'inStock']) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'inStock') {
          values.push(updates[key] ? 1 : 0);
        } else {
          values.push(updates[key]);
        }
      }
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    values.push(id);

    const [result] = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating product (MySQL)', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', id });
  } catch (err) {
    console.error('Error deleting product (MySQL)', err);
    res.status(400).json({ error: err.message });
  }
};
