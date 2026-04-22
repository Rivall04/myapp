const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'myappuser',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'myappdb'
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/entries', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
  try {
    const r = await pool.query(
      'INSERT INTO entries (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/entries', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM entries ORDER BY created_at DESC');
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

const port = process.env.PORT || 3000;
initDb()
  .then(() => app.listen(port, () => console.log(`Backend listening on ${port}`)))
  .catch(e => { console.error('DB init failed', e); process.exit(1); });
