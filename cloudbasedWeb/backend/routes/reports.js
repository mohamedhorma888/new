import express from 'express';
import { openDb, run, get, all, closeDb } from '../models/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await openDb();
  const reports = await all(db, 'SELECT * FROM reports ORDER BY created_at DESC');
  await closeDb(db);
  res.json(reports);
});

router.post('/', async (req, res) => {
  const { userName, category, quantityKg, description } = req.body;
  if (!userName || !category || typeof quantityKg !== 'number') {
    return res.status(400).json({ error: 'userName, category and quantityKg are required' });
  }
  const db = await openDb();
  const result = await run(
    db,
    'INSERT INTO reports (user_name, category, quantity_kg, description) VALUES (?, ?, ?, ?)',
    [userName, category, quantityKg, description || null]
  );
  const report = await get(db, 'SELECT * FROM reports WHERE id = ?', [result.lastID]);
  await closeDb(db);
  res.status(201).json(report);
});

router.get('/summary', async (req, res) => {
  const db = await openDb();
  const total = await get(db, 'SELECT COALESCE(SUM(quantity_kg),0) AS totalKg FROM reports');
  const byCategory = await all(db, 'SELECT category, COALESCE(SUM(quantity_kg),0) AS totalKg FROM reports GROUP BY category');
  await closeDb(db);
  res.json({ totalKg: total.totalKg, byCategory });
});

export default router;
