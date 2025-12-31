-- ============================================
-- Migration: API Key Access Policies
-- ============================================
-- This migration updates RLS policies to allow API access
-- The API validates keys server-side and passes user_id

-- 1. API Keys - Allow lookup for validation
DROP POLICY IF EXISTS "Users can view own api keys" ON api_keys;
CREATE POLICY "Allow API key lookup" ON api_keys 
  FOR SELECT USING (true);

-- 2. Novels - Already allows anyone to SELECT
-- But INSERT needs to work without auth.uid()
DROP POLICY IF EXISTS "Authenticated users can add novels" ON novels;
CREATE POLICY "Anyone can add novels" ON novels 
  FOR INSERT WITH CHECK (true);

-- 3. Novel Progress - Need to allow API access
DROP POLICY IF EXISTS "Users can view own progress" ON novel_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON novel_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON novel_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON novel_progress;

-- Allow all operations - API validates user_id server-side
CREATE POLICY "Allow progress operations" ON novel_progress 
  FOR ALL USING (true) WITH CHECK (true);

-- Note: Security is handled at the API layer:
-- 1. API key is validated and user_id is extracted
-- 2. All queries filter by the validated user_id
-- 3. Users can only access their own data through the API
