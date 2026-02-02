-- Gov Watch Database Schema
-- Run this on your Railway Postgres database to set up the tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (stores Privy user references)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  privy_did TEXT UNIQUE NOT NULL,  -- Privy's unique identifier (e.g., "did:privy:...")
  email TEXT,
  wallet_address TEXT,  -- If user connected a wallet
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Forums (enabled preset forums per user)
CREATE TABLE IF NOT EXISTS user_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  forum_cname TEXT NOT NULL,  -- References preset forum cname (e.g., "arbitrum", "aave")
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, forum_cname)
);

-- Custom Forums (user-added forums not in presets)
CREATE TABLE IF NOT EXISTS custom_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cname TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  token TEXT,
  discourse_url TEXT NOT NULL,
  discourse_category_id INTEGER,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keyword Alerts
CREATE TABLE IF NOT EXISTS keyword_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, LOWER(keyword))  -- Case-insensitive uniqueness
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_ref_id TEXT NOT NULL,  -- Format: protocol-topicId (e.g., "arbitrum-12345")
  topic_title TEXT NOT NULL,
  topic_url TEXT NOT NULL,
  protocol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_ref_id)
);

-- Read State (tracks which discussions user has read)
CREATE TABLE IF NOT EXISTS read_state (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_ref_id TEXT NOT NULL,  -- Format: protocol-topicId
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(user_id, topic_ref_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_privy_did ON users(privy_did);
CREATE INDEX IF NOT EXISTS idx_user_forums_user_id ON user_forums(user_id);
CREATE INDEX IF NOT EXISTS idx_user_forums_cname ON user_forums(forum_cname);
CREATE INDEX IF NOT EXISTS idx_custom_forums_user_id ON custom_forums(user_id);
CREATE INDEX IF NOT EXISTS idx_keyword_alerts_user_id ON keyword_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_topic_ref ON bookmarks(topic_ref_id);
CREATE INDEX IF NOT EXISTS idx_read_state_user_id ON read_state(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to user_preferences table
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helpful views

-- View: User with all their preferences
CREATE OR REPLACE VIEW user_full_profile AS
SELECT
  u.id,
  u.privy_did,
  u.email,
  u.wallet_address,
  u.created_at,
  COALESCE(p.theme, 'dark') as theme,
  COALESCE(p.onboarding_completed, false) as onboarding_completed,
  (SELECT COUNT(*) FROM user_forums uf WHERE uf.user_id = u.id AND uf.is_enabled = true) as enabled_forums_count,
  (SELECT COUNT(*) FROM custom_forums cf WHERE cf.user_id = u.id AND cf.is_enabled = true) as custom_forums_count,
  (SELECT COUNT(*) FROM keyword_alerts ka WHERE ka.user_id = u.id AND ka.is_enabled = true) as alerts_count,
  (SELECT COUNT(*) FROM bookmarks b WHERE b.user_id = u.id) as bookmarks_count
FROM users u
LEFT JOIN user_preferences p ON p.user_id = u.id;

COMMENT ON TABLE users IS 'Stores user accounts linked to Privy authentication';
COMMENT ON TABLE user_preferences IS 'User preferences like theme and onboarding status';
COMMENT ON TABLE user_forums IS 'Preset forums enabled by each user';
COMMENT ON TABLE custom_forums IS 'Custom forums added by users';
COMMENT ON TABLE keyword_alerts IS 'Keyword alerts for highlighting matching discussions';
COMMENT ON TABLE bookmarks IS 'Saved discussion bookmarks';
COMMENT ON TABLE read_state IS 'Tracks which discussions have been read';
