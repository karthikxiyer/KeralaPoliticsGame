# Supabase Setup Guide

This guide sets up automatic gameplay tracking with Supabase. The server silently captures all data — no user prompts or permissions needed.

## What Gets Tracked (Automatically)

- **IP Address** — from server logs
- **User Agent** — browser/device info
- **Timestamp** — when game completed
- **Score & Duration** — gameplay performance (in seconds)
- **Party Selected** — UDF/LDF/NDA choice
- **Game Mode** — currently "survival"

## Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create new organization

### Step 2: Create Project
1. Click **"New Project"**
2. Name: `kerala-konishtt`
3. Set a strong database password
4. Choose region nearest to you
5. Wait for initialization (~2 min)

### Step 3: Create Table
1. Go to **SQL Editor** 
2. Click **"New Query"**
3. Paste this SQL and click **"Run"**:

```sql
CREATE TABLE gameplay_sessions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  score FLOAT,
  mode TEXT,
  duration_seconds FLOAT,
  party_selected TEXT
);
```

### Step 4: Get API Keys
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (under "URL")
   - **Anon public key** (under "Anon/Public")
   - ⚠️ **Important**: Copy the FULL key, not truncated

### Step 5: Configure Render
1. Go to your Render dashboard → `kerala-konishtt` service
2. Click **Environment**
3. Add two new environment variables:
   - Key: `SUPABASE_URL` → Value: [paste your Project URL]
   - Key: `SUPABASE_KEY` → Value: [paste your Anon key]
   - ⚠️ Verify both are pasted in FULL
4. Click **Save** → **Redeploy**

### Step 6: Test It Works
1. Play the game and complete a round
2. Check Supabase dashboard → **Table Editor** → `gameplay_sessions`
3. You should see a new row with your game data

## Verify via API

Check if data is being tracked:

```bash
curl https://your-app.onrender.com/api/stats
```

Expected response:
```json
{
  "total_plays": 1,
  "avg_score": "15.42",
  "best_score": "15.42",
  "avg_duration": "15.42",
  "party_breakdown": { "udf": 1 },
  "source": "supabase"
}
```

## Server Logs

The Render server logs will show tracking activity:

```
[TRACK] 2026-01-15T10:30:45.123Z | IP: 192.168.1.1 | Party: udf | Score: 15.42s | Mode: survival
  ✓ Tracked to Supabase
```

## Fallback: Local SQLite

If Supabase keys are not set, the server automatically falls back to local SQLite (`gameplay.db`).

**Server logs will show**:
```
⚠ Supabase not configured. Using SQLite fallback.
```

## Troubleshooting

### "No rows returned" from /api/stats?
1. **Check Render environment**: Go to dashboard → Environment → verify both keys are set (full length)
2. **Redeploy after setting keys**: Changes need a redeploy to take effect
3. **Check server logs**: Go to Render → Logs tab, play a game, watch for `[TRACK]` messages
4. **Verify Supabase credentials**: Go to Supabase → Settings → API, copy keys again (very carefully)
5. **Key truncation issue**: Some copy-paste tools truncate long strings. Try copying in segments, or use Supabase UI directly

### Connection errors?
- Check internet connection on deployed app
- Verify Supabase project is active (not deleted/paused)
- Ensure IP address range is allowed in Supabase (usually automatic)

### Playing locally?
1. Create `.env` file in project root:
```
SUPABASE_URL=your_url_here
SUPABASE_KEY=your_key_here
```
2. Run `node server.js`
3. Open `http://localhost:3000`

## Data Privacy

- **No third-party tracking**: Only Supabase, your data stays in your account
- **No geolocation**: No GPS, no browser prompts
- **No cookies**: Tracking is silent, server-side only
- **Raw IP**: Captured from server logs (you can delete anytime)
