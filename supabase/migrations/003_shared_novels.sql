    -- ============================================
    -- MyNovelList - Shared Novels Architecture
    -- Novels are public, progress is per-user
    -- ============================================

    -- First drop the policies that depend on is_public column
    DROP POLICY IF EXISTS "Anyone can view public novels" ON novels;
    DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;

    -- Now we can safely drop the column
    ALTER TABLE novels DROP COLUMN IF EXISTS is_public;

    -- Create a separate table for user progress on novels
    CREATE TABLE IF NOT EXISTS novel_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    novel_id UUID REFERENCES novels(id) ON DELETE CASCADE NOT NULL,
    
    -- Progress tracking (private per user)
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'reading', 'completed', 'on_hold', 'dropped')),
    current_chapter INTEGER DEFAULT 0,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    notes TEXT,
    
    -- Dates
    started_at DATE,
    completed_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Each user can only have one progress entry per novel
    UNIQUE(user_id, novel_id),
    CONSTRAINT valid_chapter CHECK (current_chapter >= 0)
    );

    CREATE INDEX IF NOT EXISTS idx_novel_progress_user ON novel_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_novel_progress_novel ON novel_progress(novel_id);
    CREATE INDEX IF NOT EXISTS idx_novel_progress_status ON novel_progress(status);

    -- ============================================
    -- UPDATE RLS POLICIES FOR NOVELS
    -- ============================================

    -- Drop old policies
    DROP POLICY IF EXISTS "Users can view own novels" ON novels;
    DROP POLICY IF EXISTS "Users can insert own novels" ON novels;
    DROP POLICY IF EXISTS "Users can update own novels" ON novels;
    DROP POLICY IF EXISTS "Users can delete own novels" ON novels;

    -- Novels are readable by everyone
    CREATE POLICY "Anyone can view all novels" ON novels 
    FOR SELECT USING (true);

    -- Authenticated users can add novels
    CREATE POLICY "Authenticated users can add novels" ON novels 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

    -- Only the user who added a novel can update its metadata
    CREATE POLICY "Creator can update novel metadata" ON novels 
    FOR UPDATE USING (auth.uid() = user_id);

    -- Only the user who added can delete
    CREATE POLICY "Creator can delete novel" ON novels 
    FOR DELETE USING (auth.uid() = user_id);

    -- ============================================
    -- RLS POLICIES FOR NOVEL_PROGRESS
    -- ============================================

    ALTER TABLE novel_progress ENABLE ROW LEVEL SECURITY;

    -- Users can only see their own progress
    CREATE POLICY "Users can view own progress" ON novel_progress 
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own progress" ON novel_progress 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own progress" ON novel_progress 
    FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own progress" ON novel_progress 
    FOR DELETE USING (auth.uid() = user_id);

    -- ============================================
    -- UPDATED_AT TRIGGER FOR PROGRESS
    -- ============================================

    DROP TRIGGER IF EXISTS novel_progress_updated_at ON novel_progress;
    CREATE TRIGGER novel_progress_updated_at
    BEFORE UPDATE ON novel_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

    -- ============================================
    -- DONE!
    -- ============================================
