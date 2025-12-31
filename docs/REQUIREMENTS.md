# MyNovelList - Requirements Document

## 1. Problem Statement

The novel community lacks a universal tracking solution:
- **NovelUpdates**: Asian novels only, no western content
- **MyAnimeList**: Limited archive, many webnovels not addable
- **Goodreads**: Not optimized for web novels, chapter tracking absent
- **No solution** for: RoyalRoad novels, fan translations, original web fiction, religious texts, etc.

**Core Need**: Track ANY reading material with manual chapter progress, regardless of source or legitimacy in existing databases.

---

## 2. Target Users

### Primary Users
1. **Web Novel Readers**: Read from multiple sources (RoyalRoad, ScribbleHub, fan translations)
2. **Light Novel Enthusiasts**: Track official + unofficial translations
3. **Veteran Readers**: Hundreds of novels, often forget what they've read
4. **Community Recommenders**: Share tier lists and recommendations

### User Scenarios

**Scenario A - New Reader**
- Discovers novel tracker
- Signs up (or uses anonymously with local storage)
- Adds first novel manually (title, cover URL, source)
- Updates chapter progress as they read
- Exports backup periodically

**Scenario B - Veteran Reader**
- Imports existing list (JSON/CSV)
- Bulk adds novels from memory
- Creates tier lists for recommendations
- Shares public tier list link

**Scenario C - Recommender**
- Curates multiple tier lists by genre/theme
- Shares links in Discord/Reddit
- Others can view without account
- Optional: Others can clone tier list to their library

**Scenario D - Casual User (No Account)**
- Uses app with localStorage only
- Full functionality except sharing
- Can export/import JSON backup
- Upgrades to account later, imports local data

---

## 3. Functional Requirements

### 3.1 Novel Management

| ID | Requirement | Priority |
|----|-------------|----------|
| NM-1 | Add novel with: title, author (optional), cover URL (optional), source URL (optional), notes | Must |
| NM-2 | Edit novel details | Must |
| NM-3 | Delete novel | Must |
| NM-4 | Set reading status: Planning, Reading, Completed, On Hold, Dropped | Must |
| NM-5 | Set current chapter (number input) | Must |
| NM-6 | Set total chapters (optional, for completion %) | Should |
| NM-7 | Set score 1-100 | Must |
| NM-8 | Add tags/genres (user-defined) | Should |
| NM-9 | Add personal notes | Should |
| NM-10 | Track start/end dates | Could |

### 3.2 Library View

| ID | Requirement | Priority |
|----|-------------|----------|
| LV-1 | List view of all novels | Must |
| LV-2 | Grid view with covers | Should |
| LV-3 | Filter by status | Must |
| LV-4 | Filter by score range | Should |
| LV-5 | Filter by tags | Should |
| LV-6 | Sort by: title, score, date added, last updated, chapter progress | Must |
| LV-7 | Search by title/author | Must |
| LV-8 | Pagination or infinite scroll | Must |

### 3.3 Tier Lists

| ID | Requirement | Priority |
|----|-------------|----------|
| TL-1 | Create tier list with name and description | Must |
| TL-2 | Define custom tiers (S, A, B, C, D, F or custom labels) | Must |
| TL-3 | Drag novels into tiers | Must |
| TL-4 | Add novels not in library (for recommendation purposes) | Should |
| TL-5 | Public/private toggle | Must |
| TL-6 | Shareable link | Must |
| TL-7 | View tier list without account | Must |
| TL-8 | Clone tier list to own library | Could |

### 3.4 Data Management

| ID | Requirement | Priority |
|----|-------------|----------|
| DM-1 | Export library as JSON | Must |
| DM-2 | Import library from JSON | Must |
| DM-3 | Export as CSV | Should |
| DM-4 | Import from CSV | Should |
| DM-5 | Merge import (don't overwrite existing) | Should |
| DM-6 | Local storage mode (no account) | Must |
| DM-7 | Sync local to cloud on signup | Should |

### 3.5 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| AU-1 | Email/password signup | Must |
| AU-2 | OAuth (Google, GitHub) | Should |
| AU-3 | Anonymous/guest mode with localStorage | Must |
| AU-4 | Account deletion with data wipe | Must |
| AU-5 | Password reset | Must |

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load < 2s on 3G
- Library renders 500+ novels smoothly
- Tier list drag-drop at 60fps

### 4.2 Storage Optimization (Critical for Free Tier)
- No image uploads - URL references only
- Compress cover thumbnails if stored (< 10KB each)
- Lazy load images
- Paginate API responses
- Index frequently queried columns

### 4.3 Scalability Targets (Free Tier Limits)
- Supabase Free: 500MB database, 2GB bandwidth/month
- Estimated per user: ~50KB for 500 novels
- Target: 5,000 users on free tier

### 4.4 Security
- Row Level Security (RLS) on all tables
- Users can only access own data
- Public tier lists readable by all
- Rate limiting on API
- Input sanitization

### 4.5 Accessibility
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Mobile responsive

---

## 5. Constraints

1. **Budget**: $0 - must use free tiers only
2. **Maintenance**: Minimal - no complex infrastructure
3. **No image hosting**: URLs only to save storage
4. **No scraping**: User manually enters data
5. **No copyrighted content storage**: Only metadata

---

## 6. Out of Scope (v1)

- Social features (following users, comments)
- Novel database/search (like MAL's database)
- Automatic chapter detection
- Reading within the app
- Mobile native apps
- Notifications
- Statistics/analytics dashboard

---

## 7. Success Metrics

1. User can add a novel in < 30 seconds
2. User can update chapter in < 5 seconds
3. Export/import works reliably
4. Tier list sharing generates valid links
5. App works offline with localStorage
