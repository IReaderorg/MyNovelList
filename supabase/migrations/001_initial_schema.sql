-- MyNovelList Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Novels
CREATE TABLE IF NOT EXISTS novels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  source_url TEXT,
  
  -- Tracking
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'reading', 'completed', 'on_hold', 'dropped')),
  current_chapter INTEGER DEFAULT 0,
  total_chapters INTEGER,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  
  -- Metadata
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_chapter CHECK (current_chapter >= 0)
);

-- Indexes for novels
CREATE INDEX IF NOT EXISTS idx_novels_user_id ON novels(user_id);
CREATE INDEX IF NOT EXISTS idx_novels_status ON novels(status);
CREATE INDEX IF NOT EXISTS idx_novels_score ON novels(score);
CREATE INDEX IF NOT EXISTS idx_novels_updated ON novels(updated_at DESC);

-- Tier Lists
CREATE TABLE IF NOT EXISTS tier_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  
  tiers JSONB DEFAULT '[
    {"name": "S", "color": "#ff7f7f"},
    {"name": "A", "color": "#ffbf7f"},
    {"name": "B", "color": "#ffff7f"},
    {"name": "C", "color": "#7fff7f"},
    {"name": "D", "color": "#7fbfff"},
    {"name": "F", "color": "#bf7fff"}
  ]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tier List Items
CREATE TABLE IF NOT EXISTS tier_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_list_id UUID REFERENCES tier_lists(id) ON DELETE CASCADE NOT NULL,
  
  novel_id UUID REFERENCES novels(id) ON DELETE SET NULL,
  
  title TEXT,
  cover_url TEXT,
  
  tier_name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_item CHECK (novel_id IS NOT NULL OR title IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_tier_list_items_list ON tier_list_items(tier_list_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_list_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Novels policies
CREATE POLICY "Users can view own novels" ON novels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own novels" ON novels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own novels" ON novels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own novels" ON novels FOR DELETE USING (auth.uid() = user_id);

-- Tier Lists policies
CREATE POLICY "Users can view own tier lists" ON tier_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public tier lists" ON tier_lists FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert own tier lists" ON tier_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tier lists" ON tier_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tier lists" ON tier_lists FOR DELETE USING (auth.uid() = user_id);

-- Tier List Items policies
CREATE POLICY "Users can view own tier list items" ON tier_list_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));
CREATE POLICY "Anyone can view public tier list items" ON tier_list_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND is_public = true));
CREATE POLICY "Users can insert own tier list items" ON tier_list_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own tier list items" ON tier_list_items FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own tier list items" ON tier_list_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
