require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup (optional - uses online DB if configured)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  console.log('✓ Using Supabase for online database');
}

// Local SQLite fallback
let db = null;
if (!supabase) {
  const sqlite3 = require('sqlite3').verbose();
  db = new sqlite3.Database('./gameplay.db');
  console.log('⚠ Using local SQLite database');
  
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS gameplay_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      score REAL,
      mode TEXT,
      duration_seconds REAL,
      party_selected TEXT
    )`);
  });
}

// API endpoint to track gameplay
app.post('/api/track', async (req, res) => {
  const {
    score,
    duration,
    mode,
    party
  } = req.body;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (supabase) {
    // Use Supabase
    const { data, error } = await supabase
      .from('gameplay_sessions')
      .insert([{
        ip_address: ip,
        user_agent: userAgent,
        score: parseFloat(score),
        mode: mode,
        duration_seconds: parseFloat(duration),
        party_selected: party
      }]);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'Failed to record gameplay' });
    } else {
      res.json({ success: true, source: 'supabase' });
    }
  } else {
    // Use local SQLite
    const stmt = db.prepare(`
      INSERT INTO gameplay_sessions
      (ip_address, user_agent, score, mode, duration_seconds, party_selected)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run([ip, userAgent, score, mode, duration, party], (err) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to record gameplay' });
      } else {
        res.json({ success: true, source: 'sqlite' });
      }
    });

    stmt.finalize();
  }
});

// API endpoint to get stats
app.get('/api/stats', async (req, res) => {
  if (supabase) {
    // Use Supabase
    const { data, error } = await supabase
      .from('gameplay_sessions')
      .select('score, duration_seconds');

    if (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    } else {
      const totalPlays = data.length;
      const avgScore = data.length > 0 
        ? (data.reduce((sum, d) => sum + parseFloat(d.score), 0) / data.length).toFixed(2)
        : 0;
      const bestScore = data.length > 0
        ? Math.max(...data.map(d => parseFloat(d.score))).toFixed(2)
        : 0;
      const avgDuration = data.length > 0
        ? (data.reduce((sum, d) => sum + parseFloat(d.duration_seconds), 0) / data.length).toFixed(2)
        : 0;

      res.json({
        total_plays: totalPlays,
        avg_score: avgScore,
        best_score: bestScore,
        avg_duration: avgDuration,
        source: 'supabase'
      });
    }
  } else {
    // Use local SQLite
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
        res.json({ ...rows[0], source: 'sqlite' });
      }
    });
  }
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
  if (db) db.close();
  process.exit();
});
