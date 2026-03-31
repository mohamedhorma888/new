import { openDb, run, closeDb } from './models/db.js';

async function migrate() {
  const db = await openDb();
  await run(
    db,
    `CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity_kg REAL NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  );
  console.log('Migration complete');
  await closeDb(db);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
