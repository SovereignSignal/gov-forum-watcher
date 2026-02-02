# Gov Watch V1 Roadmap

## Current Status (After QA Testing - Feb 2, 2026)

### Working Features
- [x] Forum aggregation from 70+ Discourse-based governance forums
- [x] Discussion feed with loading states
- [x] Keyword alerts with highlighting
- [x] Bookmarking with Saved view
- [x] Read/unread tracking
- [x] Sorting (Recent, Replies, Views, Likes)
- [x] Date filtering (Today, Week, Month, All Time)
- [x] Forum source filtering
- [x] Search functionality
- [x] Dark/Light theme toggle
- [x] Mobile responsive layout
- [x] Export/Import configuration (JSON backup)
- [x] Onboarding wizard
- [x] Keyboard shortcuts
- [x] Offline detection
- [x] Rate limiting

### Bug Fixes Applied
- [x] Tags rendering crash (Discourse API returns mixed formats) - Fixed Feb 2, 2026

---

## V1 Feature Requirements

### 1. User Authentication (Privy)
**Priority: P0 - Required for V1**

Implement user authentication using Privy to enable:
- Email login (primary)
- Social login (Google, Discord, Twitter)
- Wallet login (MetaMask, WalletConnect for web3 users)
- Progressive authentication (start anonymous, upgrade to account)

**Tasks:**
- [ ] Set up Privy account and get API keys
- [ ] Install Privy React SDK (`@privy-io/react-auth`)
- [ ] Create PrivyProvider wrapper in app layout
- [ ] Add login/logout UI to sidebar header
- [ ] Create user profile component
- [ ] Handle authentication state throughout app
- [ ] Protect routes if needed (or keep app accessible with anonymous mode)

### 2. Database for User Data Persistence
**Priority: P0 - Required for V1**

Move from localStorage to server-side storage for authenticated users:
- User preferences (theme, enabled forums)
- Keyword alerts
- Bookmarks
- Read state

**Options:**
1. **Supabase** (Recommended) - PostgreSQL, auth integration, real-time, free tier
2. **PlanetScale** - MySQL, serverless, free tier
3. **Neon** - Serverless Postgres, good free tier
4. **Railway Postgres** - Already on Railway for hosting

**Tasks:**
- [ ] Choose and set up database provider
- [ ] Design schema for users, preferences, alerts, bookmarks
- [ ] Create API routes for CRUD operations
- [ ] Update hooks to sync with database when authenticated
- [ ] Keep localStorage as fallback for anonymous users
- [ ] Add migration path from localStorage to database

### 3. Landing Page Enhancement
**Priority: P1 - Nice to have**

- [ ] Add login/signup CTA on landing page
- [ ] Show testimonials or use cases
- [ ] Add "Try without signing up" option

---

## Database Schema Design (Draft)

```sql
-- Users (managed by Privy, we store reference)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  privy_did TEXT UNIQUE NOT NULL,  -- Privy's unique identifier
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Forums (enabled forums per user)
CREATE TABLE user_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  forum_cname TEXT NOT NULL,  -- References preset forum cname
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, forum_cname)
);

-- Custom Forums (user-added forums)
CREATE TABLE custom_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cname TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  discourse_url TEXT NOT NULL,
  discourse_category_id INTEGER,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keyword Alerts
CREATE TABLE keyword_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, keyword)
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_ref_id TEXT NOT NULL,  -- protocol-topicId
  topic_title TEXT NOT NULL,
  topic_url TEXT NOT NULL,
  protocol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_ref_id)
);

-- Read State
CREATE TABLE read_state (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_ref_id TEXT NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(user_id, topic_ref_id)
);

-- Indexes
CREATE INDEX idx_user_forums_user_id ON user_forums(user_id);
CREATE INDEX idx_keyword_alerts_user_id ON keyword_alerts(user_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_read_state_user_id ON read_state(user_id);
```

---

## Implementation Order

### Phase 1: Database Setup (1-2 days)
1. Set up Supabase project
2. Create schema and migrations
3. Configure environment variables
4. Test database connectivity

### Phase 2: Privy Authentication (1-2 days)
1. Create Privy account and app
2. Install and configure SDK
3. Add PrivyProvider to app
4. Create login/logout UI
5. Display user profile when logged in

### Phase 3: Data Sync (2-3 days)
1. Create API routes for CRUD operations
2. Update useForums hook to sync with database
3. Update useAlerts hook to sync with database
4. Update useBookmarks hook to sync with database
5. Update useReadState hook to sync with database
6. Update useTheme hook to sync preference
7. Handle anonymous vs authenticated mode

### Phase 4: Polish & Testing (1 day)
1. Test authentication flow
2. Test data persistence
3. Test localStorage fallback
4. Handle edge cases (logout, multiple devices)
5. Deploy and verify on production

---

## Environment Variables Needed

```env
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Questions to Resolve

1. **Anonymous mode?** - Should users be able to use the app without logging in? (Recommended: Yes, with localStorage fallback)
2. **Data migration?** - Should we offer to migrate localStorage data to account on signup?
3. **Multi-device sync?** - Real-time sync or manual refresh?
4. **Privy login methods?** - Which to enable (email, Google, Discord, wallet)?

---

## References

- [Privy Documentation](https://docs.privy.io)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router Auth Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
