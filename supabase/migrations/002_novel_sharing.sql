-- ============================================
-- MyNovelList - Novel Sharing Feature
-- Run this after 001_initial_schema.sql
-- ============================================

-- Add is_public column to novels
ALTER TABLE novels ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add display_name to profiles for public sharing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Index for public novels
CREATE INDEX IF NOT EXISTS idx_novels_public ON novels(is_public) WHERE is_public = true;

-- ============================================
-- UPDATE RLS POLICIES FOR PUBLIC NOVELS
-- ============================================

-- Allow anyone to view public novels
DROP POLICY IF EXISTS "Anyone can view public novels" ON novels;
CREATE POLICY "Anyone can view public novels" ON novels 
  FOR SELECT USING (is_public = true);

-- Allow anyone to view profiles of users with public content
DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;
CREATE POLICY "Anyone can view public profiles" ON profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM novels WHERE novels.user_id = profiles.id AND novels.is_public = true
      UNION
      SELECT 1 FROM tier_lists WHERE tier_lists.user_id = profiles.id AND tier_lists.is_public = true
    )
  );

-- ============================================
-- DONE!
-- ============================================
