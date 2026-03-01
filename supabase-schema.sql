-- Run this in your Supabase SQL Editor
-- https://app.supabase.com → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS ww3_predictions (
  id          SERIAL PRIMARY KEY,
  score       INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning   TEXT,
  key_factors JSONB,   -- ["factor1", "factor2", ...]
  news_sample JSONB,   -- top 5 headlines used in analysis
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast latest-row queries
CREATE INDEX IF NOT EXISTS idx_ww3_predictions_created_at
  ON ww3_predictions (created_at DESC);

-- Enable Row Level Security
ALTER TABLE ww3_predictions ENABLE ROW LEVEL SECURITY;

-- Allow public read (for the /api/prediction route using anon key)
CREATE POLICY "Allow public read" ON ww3_predictions
  FOR SELECT USING (true);

-- Restrict writes to service role only (cron endpoint uses service role key)
-- No INSERT policy for anon key — writes must use service role

-- Seed with an initial prediction so the homepage isn't blank on first deploy
INSERT INTO ww3_predictions (score, reasoning, key_factors, news_sample)
VALUES (
  52,
  'Multiple active conflict zones with elevated military tensions between major powers. Nuclear sabre-rattling continues but diplomatic channels remain open.',
  '["Russia-Ukraine conflict ongoing with no diplomatic resolution in sight", "US-China tensions over Taiwan Strait military exercises", "Iran nuclear enrichment program approaching weapons-grade threshold", "NATO expanding eastward deployments in response to Russian threat", "North Korea ICBM tests increasing in frequency and range"]',
  '["Russia launches overnight strikes on Ukrainian energy infrastructure", "China conducts live-fire naval exercises near Taiwan", "Iran enriches uranium to 84%, near weapons-grade", "NATO deploys additional troops to eastern flank", "North Korea tests new intercontinental ballistic missile"]'
);
