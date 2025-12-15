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

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/hello', async (req, res) => {
	  try {
		      const r = await pool.query('SELECT NOW() as now');
		      res.json({ msg: 'Hello from backend', time: r.rows[0].now });
		    } catch (e) {
			        console.error(e);
			        res.status(500).json({ error: 'db error' });
			      }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on ${port}`));

