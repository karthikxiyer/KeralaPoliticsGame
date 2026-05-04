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
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log('✓ Supabase configured');
    console.log('  URL:', process.env.SUPABASE_URL);
    console.log('  Key length:', process.env.SUPABASE_KEY.length);
  } catch (err) {
    console.error('✗ Failed to initialize Supabase:', err.message);
  }
} else {
  console.log('⚠ Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY.');
  if (!process.env.SUPABASE_URL) console.log('  Missing: SUPABASE_URL');
  if (!process.env.SUPABASE_KEY) console.log('  Missing: SUPABASE_KEY');
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
  const { score, duration, mode, party } = req.body;

  // Capture metadata automatically
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const timestamp = new Date().toISOString();

  console.log(`[TRACK] ${timestamp} | IP: ${ip} | Party: ${party} | Score: ${score}s | Mode: ${mode}`);

  if (supabase) {
    // Use Supabase
    try {
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
        console.error('  ✗ Supabase error:', error.message);
        res.status(500).json({ error: 'Database error', details: error.message });
      } else {
        console.log('  ✓ Tracked to Supabase');
        res.json({ success: true, source: 'supabase', timestamp });
      }
    } catch (err) {
      console.error('  ✗ Exception:', err.message);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  } else {
    // Use local SQLite fallback
    if (!db) {
      console.error('  ✗ No database available');
      res.status(500).json({ error: 'Database not initialized' });
      return;
    }

    db.run(
      `INSERT INTO gameplay_sessions (ip_address, user_agent, score, mode, duration_seconds, party_selected) VALUES (?, ?, ?, ?, ?, ?)`,
      [ip, userAgent, parseFloat(score), mode, parseFloat(duration), party],
      function(err) {
        if (err) {
          console.error('  ✗ SQLite error:', err.message);
          res.status(500).json({ error: 'Database error', details: err.message });
        } else {
          console.log('  ✓ Tracked to SQLite (ID:', this.lastID + ')');
          res.json({ success: true, source: 'sqlite', timestamp, id: this.lastID });
        }
      }
    );
  }
});

// API endpoint to get stats
app.get('/api/stats', async (req, res) => {
  console.log('[STATS] Fetching gameplay statistics');

  if (supabase) {
    // Use Supabase
    try {
      const { data, error } = await supabase
        .from('gameplay_sessions')
        .select('score, duration_seconds, party_selected');

      if (error) {
        console.error('  ✗ Supabase error:', error.message);
        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
      } else {
        const totalPlays = data.length;
        const avgScore = data.length > 0
          ? (data.reduce((sum, d) => sum + parseFloat(d.score || 0), 0) / data.length).toFixed(2)
          : 0;
        const bestScore = data.length > 0
          ? Math.max(...data.map(d => parseFloat(d.score || 0))).toFixed(2)
          : 0;
        const avgDuration = data.length > 0
          ? (data.reduce((sum, d) => sum + parseFloat(d.duration_seconds || 0), 0) / data.length).toFixed(2)
          : 0;

        const partyBreakdown = {};
        data.forEach(d => {
          const p = d.party_selected || 'unknown';
          partyBreakdown[p] = (partyBreakdown[p] || 0) + 1;
        });

        console.log(`  ✓ Found ${totalPlays} sessions`);
        res.json({
          total_plays: totalPlays,
          avg_score: avgScore,
          best_score: bestScore,
          avg_duration: avgDuration,
          party_breakdown: partyBreakdown,
          source: 'supabase'
        });
      }
    } catch (err) {
      console.error('  ✗ Exception:', err.message);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  } else {
    // Use local SQLite
    if (!db) {
      console.error('  ✗ No database available');
      res.status(500).json({ error: 'Database not initialized' });
      return;
    }

    db.all(`
      SELECT COUNT(*) as total_plays,
             AVG(score) as avg_score,
             MAX(score) as best_score,
             AVG(duration_seconds) as avg_duration
      FROM gameplay_sessions
    `, (err, rows) => {
      if (err) {
        console.error('  ✗ SQLite error:', err.message);
        res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
      } else {
        console.log(`  ✓ Found ${rows[0]?.total_plays || 0} sessions`);
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
