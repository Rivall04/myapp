import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || '/api';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  function loadEntries() {
    fetch(`${API}/entries`)
      .then(r => r.json())
      .then(setEntries)
      .catch(() => setStatus('Failed to load entries'));
  }

  useEffect(() => { loadEntries(); }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    fetch(`${API}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(r => r.json())
      .then(() => { setName(''); setStatus(''); loadEntries(); })
      .catch(() => setStatus('Failed to save entry'));
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 500 }}>
      <h1>MyApp</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter a name"
          style={{ flex: 1, padding: '6px 10px', fontSize: 14 }}
        />
        <button type="submit" style={{ padding: '6px 16px' }}>Save</button>
      </form>

      {status && <p style={{ color: 'red' }}>{status}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Name</th>
            <th style={th}>Saved at</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td style={td}>{entry.id}</td>
              <td style={td}>{entry.name}</td>
              <td style={td}>{new Date(entry.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #ccc' };
const td = { padding: '6px 10px', borderBottom: '1px solid #eee' };
