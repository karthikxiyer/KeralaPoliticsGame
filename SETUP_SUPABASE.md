# Supabase Setup Guide

This guide will help you set up a free online database on Supabase to track gameplay.

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended) or email
3. Create a new organization

## Step 2: Create a Project

1. Click "New project"
2. Name it: `kerala-konishtt`
3. Create a strong database password
4. Choose a region closest to you
5. Click "Create new project" and wait for it to initialize

## Step 3: Create the Table

1. In the Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste this SQL:

```sql
CREATE TABLE gameplay_sessions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  score FLOAT,
  mode TEXT,
  duration_seconds FLOAT,
  party_selected TEXT
);
```

4. Click "Run"

## Step 4: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy your:
   - Project URL (Supabase URL)
   - anon/public key (Supabase Key)

## Step 5: Set Environment Variables

Create a `.env` file in your project root:

```
SUPABASE_URL=your_project_url_here
SUPABASE_KEY=your_anon_key_here
```

**Important**: Add `.env` to `.gitignore` (already done) so you don't commit secrets!

## Step 6: Deploy on Render

1. Go to your Render dashboard
2. Click on your `kerala-konishtt` service
3. Go to **Environment**
4. Add these environment variables:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase anon key

5. Redeploy the service

## Step 7: Verify It's Working

1. Play the game and complete a round
2. Go to Supabase dashboard → **Table Editor**
3. Click `gameplay_sessions` - you should see your gameplay data!

## View Your Data

### In Supabase Dashboard:
- Go to Table Editor → gameplay_sessions
- See all gameplay sessions with IP, location, score, party, etc.

### Via API:
```bash
curl https://your-render-app.onrender.com/api/stats
```

## Notes

- **Free tier**: Supabase free tier includes 500MB database, plenty for this
- **IP Address**: Automatically captured from server
- **Location**: Requires browser permission (user sees a popup)
- **Geolocation**: Works in HTTPS (Render provides HTTPS)
- **Fallback**: If Supabase isn't configured, it uses local SQLite automatically

## Troubleshooting

If tracking doesn't work:
1. Check Render logs: `render deploy logs`
2. Make sure `SUPABASE_URL` and `SUPABASE_KEY` are set in Render
3. Check browser console for errors (F12)
4. Fallback to local SQLite works automatically if Supabase not configured
