# MyNovelList - Technical Design Document

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    SvelteKit (SSR)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐    │
│  │ Library │  │  Novel  │  │  Tier   │  │   Auth      │    │
│  │  View   │  │  Editor │  │  Lists  │  │   Pages     │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────┘    │
│                         │                                    │
│              ┌──────────┴──────────┐                        │
│              │   Local Storage     │ (Offline/Guest Mode)   │
│              │   Adapter           │                        │
│              └──────────┬──────────┘                        │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Auth       │  │  PostgreSQL │  │  Row Level Security │  │
│  │  (Free)     │  │  (500MB)    │  │  (Per-user data)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Technology Choices

### Frontend: SvelteKit
**Why:**
- Smallest bundle size of major frameworks (~40% smaller than React)
- Built-in SSR for SEO (tier list sharing)
- File-based routing
- No virtual DOM = faster runtime
- Great DX with less boilerplate

### Backend: Supabase
**Why:**
- Generous free tier (500MB DB, 50k MAU)
- Built-in auth with OAuth
- Row Level Security = secure by default
- Real-time subscriptions (future feature)
- Auto-generated REST API
- PostgreSQL = powerful queries

### Hosting: Vercel
**Why:**
- Free tier with generous limits
- Native SvelteKit support
- Edge functions
- Automatic HTTPS
- Preview deployments

### Styling: Tailwind CSS
**Why:**
- Utility-first = small CSS bundle
- Purges unused styles
- Consistent design system
- Dark mode built-in

---

## 3. Database Schema

```sql
-- Users (managed by Supabase Auth, extended with profile)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Novels
CREATE TABLE novels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
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
  tags TEXT[], -- PostgreSQL array for efficiency
  
  -- Timestamps
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for common queries
  CONSTRAINT valid_chapter CHECK (current_chapter >= 0)
);

-- Indexes
CREATE INDEX idx_novels_user_id ON novels(user_id);
CREATE INDEX idx_novels_status ON novels(status);
CREATE INDEX idx_novels_score ON novels(score);
CREATE INDEX idx_novels_updated ON novels(updated_at DESC);

-- Tier Lists
CREATE TABLE tier_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  
  -- Tier configuration as JSONB for flexibility
  -- Example: [{"name": "S", "color": "#ff0000"}, {"name": "A", "color": "#ff8800"}]
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

-- Tier List Items (novels in tier lists)
CREATE TABLE tier_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_list_id UUID REFERENCES tier_lists(id) ON DELETE CASCADE NOT NULL,
  
  -- Can reference existing novel OR be standalone entry
  novel_id UUID REFERENCES novels(id) ON DELETE SET NULL,
  
  -- Standalone entry fields (used when novel_id is null)
  title TEXT,
  cover_url TEXT,
  
  -- Position
  tier_name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Either novel_id or title must be set
  CONSTRAINT valid_item CHECK (novel_id IS NOT NULL OR title IS NOT NULL)
);

CREATE INDEX idx_tier_list_items_list ON tier_list_items(tier_list_id);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_list_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Novels: users can only CRUD their own
CREATE POLICY "Users can view own novels" ON novels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own novels" ON novels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own novels" ON novels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own novels" ON novels FOR DELETE USING (auth.uid() = user_id);

-- Tier Lists: own lists + public lists viewable
CREATE POLICY "Users can view own tier lists" ON tier_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public tier lists" ON tier_lists FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert own tier lists" ON tier_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tier lists" ON tier_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tier lists" ON tier_lists FOR DELETE USING (auth.uid() = user_id);

-- Tier List Items: follow parent tier list permissions
CREATE POLICY "Users can view own tier list items" ON tier_list_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND (user_id = auth.uid() OR is_public = true)));
CREATE POLICY "Users can insert own tier list items" ON tier_list_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own tier list items" ON tier_list_items FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own tier list items" ON tier_list_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM tier_lists WHERE id = tier_list_id AND user_id = auth.uid()));
```

### Storage Estimation

| Data | Size per item | Items per user | Total per user |
|------|---------------|----------------|----------------|
| Novel | ~500 bytes | 500 | 250 KB |
| Tier List | ~200 bytes | 10 | 2 KB |
| Tier Items | ~100 bytes | 200 | 20 KB |
| **Total** | | | **~272 KB** |

**Free tier capacity**: 500MB / 272KB ≈ **1,800 users** (conservative)

---

## 4. Application Structure

```
novel-tracker/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── NovelCard.svelte
│   │   │   ├── NovelForm.svelte
│   │   │   ├── NovelList.svelte
│   │   │   ├── TierList.svelte
│   │   │   ├── TierRow.svelte
│   │   │   ├── FilterBar.svelte
│   │   │   ├── SearchInput.svelte
│   │   │   └── ui/
│   │   │       ├── Button.svelte
│   │   │       ├── Input.svelte
│   │   │       ├── Select.svelte
│   │   │       ├── Modal.svelte
│   │   │       └── Toast.svelte
│   │   ├── stores/
│   │   │   ├── auth.ts
│   │   │   ├── novels.ts
│   │   │   ├── tierLists.ts
│   │   │   └── localStorage.ts
│   │   ├── services/
│   │   │   ├── supabase.ts
│   │   │   ├── novelService.ts
│   │   │   ├── tierListService.ts
│   │   │   └── exportService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── validation.ts
│   │       └── helpers.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte (Landing/Library)
│   │   ├── auth/
│   │   │   ├── login/+page.svelte
│   │   │   ├── signup/+page.svelte
│   │   │   └── callback/+page.svelte
│   │   ├── library/
│   │   │   └── +page.svelte
│   │   ├── novel/
│   │   │   ├── new/+page.svelte
│   │   │   └── [id]/+page.svelte
│   │   ├── tier-lists/
│   │   │   ├── +page.svelte
│   │   │   ├── new/+page.svelte
│   │   │   └── [id]/+page.svelte
│   │   ├── share/
│   │   │   └── [id]/+page.svelte (Public tier list view)
│   │   └── settings/
│   │       └── +page.svelte (Export/Import)
│   └── app.html
├── static/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── package.json
├── svelte.config.js
├── tailwind.config.js
├── vite.config.ts
└── .env.example
```

---

## 5. Key Flows

### 5.1 Guest Mode Flow
```
1. User visits site
2. Check localStorage for existing data
3. If exists, load into store
4. All CRUD operations write to localStorage
5. On signup, offer to merge localStorage → Supabase
6. Clear localStorage after successful merge
```

### 5.2 Novel Quick-Add Flow
```
1. User clicks "+" button
2. Modal opens with minimal form (title required)
3. User enters title, optionally cover URL
4. Submit → instant add to library
5. Can edit later for more details
```

### 5.3 Chapter Update Flow
```
1. In library view, each novel shows chapter input
2. User types new chapter number
3. Debounced save (300ms) to prevent spam
4. Visual feedback (checkmark)
5. updated_at timestamp refreshed
```

### 5.4 Tier List Sharing Flow
```
1. User creates tier list
2. Toggles "Public" switch
3. System generates shareable URL: /share/{uuid}
4. User copies link
5. Recipient opens link (no auth required)
6. Read-only view of tier list
7. Optional "Clone to my library" button (requires auth)
```

### 5.5 Export/Import Flow
```
Export:
1. User goes to Settings
2. Clicks "Export JSON"
3. System fetches all user data
4. Generates JSON blob
5. Browser downloads file

Import:
1. User selects JSON file
2. System validates schema
3. Preview of data to import
4. User chooses: Replace All / Merge
5. System processes import
6. Success/error feedback
```

---

## 6. API Endpoints (Supabase Auto-generated)

All via Supabase client library:

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List novels | GET | /rest/v1/novels?user_id=eq.{id} |
| Get novel | GET | /rest/v1/novels?id=eq.{id} |
| Create novel | POST | /rest/v1/novels |
| Update novel | PATCH | /rest/v1/novels?id=eq.{id} |
| Delete novel | DELETE | /rest/v1/novels?id=eq.{id} |
| List tier lists | GET | /rest/v1/tier_lists |
| Get public tier list | GET | /rest/v1/tier_lists?id=eq.{id}&is_public=eq.true |

---

## 7. Security Considerations

1. **RLS enforced at database level** - even if frontend is compromised, data is protected
2. **No sensitive data stored** - only reading metadata
3. **Cover URLs validated** - prevent XSS via image URLs
4. **Rate limiting** - Supabase built-in + Vercel edge
5. **Input sanitization** - all user input escaped
6. **HTTPS only** - enforced by Vercel

---

## 8. Performance Optimizations

1. **Pagination**: 50 novels per page, cursor-based
2. **Lazy loading**: Images load on scroll
3. **Debouncing**: Chapter updates debounced 300ms
4. **Optimistic UI**: Update UI before server confirms
5. **Service Worker**: Cache static assets
6. **Image placeholders**: Show placeholder while loading covers

---

## 9. Future Considerations (v2+)

- Real-time sync across devices
- Statistics dashboard
- Social features (follow users)
- Novel database with search
- Browser extension for quick-add
- Mobile PWA improvements
