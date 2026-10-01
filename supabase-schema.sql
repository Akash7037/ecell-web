-- Supabase SQL Schema for E-Cell VSBCETC Website
-- Run this in your Supabase Dashboard -> SQL Editor (takes 5 seconds)

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT,
  is_free BOOLEAN DEFAULT true,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  registration_url TEXT,
  image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  portfolio_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. Policies: Allow read & write access
CREATE POLICY "Allow public read on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow service/anon write on events" ON events FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow service/anon write on members" ON members FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert on subscribers" ON subscribers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read on subscribers" ON subscribers FOR SELECT USING (true);

CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow service/anon write on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

