-- Create the sessions table in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL,
  questions_answered JSONB NOT NULL,
  duration INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster retrieval of user-specific sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
