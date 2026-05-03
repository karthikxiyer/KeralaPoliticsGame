const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./gameplay.db');

// Middleware
app.use(cors());
app.use(express.json());

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS gameplay_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    location TEXT,
    latitude REAL,
    longitude REAL,
    score REAL,
    mode TEXT,
    duration_seconds REAL,
    party_selected TEXT
  )`);
});

// API endpoint to track gameplay
app.post('/api/track', (req, res) => {
  const {
    score,
    duration,
    mode,
    party,
    latitude,
    longitude,
    location
  } = req.body;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const stmt = db.prepare(`
    INSERT INTO gameplay_sessions 
    (ip_address, user_agent, location, latitude, longitude, score, mode, duration_seconds, party_selected)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([ip, userAgent, location || null, latitude || null, longitude || null, score, mode, duration, party], (err) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to record gameplay' });
    } else {
      res.json({ success: true });
    }
  });

  stmt.finalize();
});

// API endpoint to get stats (optional)
app.get('/api/stats', (req, res) => {
  db.all(`
    SELECT COUNT(*) as total_plays, 
           AVG(score) as avg_score,
           MAX(score) as best_score,
           AVG(duration_seconds) as avg_duration
    FROM gameplay_sessions
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    } else {
      res.json(rows[0]);
    }
  });
});

// Serve static files
app.use(express.static('.'));

// SPA fallback - rewrite all unknown routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kerala Konishtt tracking server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit();
});
