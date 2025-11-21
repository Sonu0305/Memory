-- Memory Puzzle Game - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table: stores user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images table: stores uploaded image metadata and blob URLs
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blob_url TEXT NOT NULL,
  blob_pathname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game states table: stores game progress for resuming
CREATE TABLE IF NOT EXISTS game_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- Only one saved game per user
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_game_states_user_id ON game_states(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- RLS (Row Level Security) Policies
-- Note: For simplicity, we're using anon key with permissive policies
-- In production, you may want to implement proper authentication

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated and anonymous users
-- Adjust these policies based on your security requirements
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on images" ON images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on game_states" ON game_states FOR ALL USING (true) WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_states_updated_at
  BEFORE UPDATE ON game_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE profiles IS 'Stores user profiles with name and timestamps';
COMMENT ON TABLE images IS 'Stores uploaded image metadata with Vercel Blob URLs';
COMMENT ON TABLE game_states IS 'Stores serialized game state for resume functionality';
