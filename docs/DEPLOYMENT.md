# MyNovelList - Deployment Guide

## Prerequisites

1. A [Supabase](https://supabase.com) account (free tier works)
2. A [Netlify](https://netlify.com) account (free tier works)
3. Your code pushed to GitHub/GitLab/Bitbucket

---

## Step 1: Setup Supabase

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization, enter project name (e.g., "mynovellist")
4. Set a strong database password (save it!)
5. Select region closest to your users
6. Click "Create new project" and wait ~2 minutes

### 1.2 Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the editor
5. Click "Run" (or Ctrl+Enter)
6. You should see "Success. No rows returned" - this is correct!

### 1.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Netlify):
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`

### 1.4 Configure Auth (Optional)

1. Go to **Authentication** → **Providers**
2. Email is enabled by default
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL** to your Netlify domain (after deployment): `https://your-app.netlify.app`

---

## Step 2: Deploy to Netlify

### 2.1 Connect Repository

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository

### 2.2 Configure Build Settings

Set these values:

| Setting | Value |
|---------|-------|
| Base directory | `novel-tracker` (if in subdirectory) or leave blank |
| Build command | `npm run build` |
| Publish directory | `build` |

### 2.3 Set Environment Variables

Click "Add environment variables" and add:

| Key | Value |
|-----|-------|
| `PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 2.4 Deploy

1. Click "Deploy site"
2. Wait for build to complete (~1-2 minutes)
3. Your site is live at `https://random-name.netlify.app`

### 2.5 Custom Domain (Optional)

1. Go to **Domain settings**
2. Click "Add custom domain"
3. Follow DNS configuration instructions

---

## Step 3: Post-Deployment

### 3.1 Update Supabase Auth URL

1. Go back to Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL** to your actual Netlify URL
3. Add your domain to **Redirect URLs**: `https://your-app.netlify.app/*`

### 3.2 Test Your Deployment

1. Visit your site
2. Create an account
3. Add a novel
4. Create a tier list
5. Test the API (Settings → API Keys)

---

## Troubleshooting

### Build Fails with "Cannot find module"

Make sure `package.json` has all dependencies. Run locally first:
```bash
npm install
npm run build
```

### "Invalid API key" Errors

- Check environment variables are set correctly in Netlify
- Ensure no extra spaces in the values
- Redeploy after changing env vars

### Auth Not Working

- Verify Site URL in Supabase matches your Netlify URL
- Check Redirect URLs include your domain
- Make sure you ran the database migration

### API Endpoints Return 404

The Netlify adapter handles API routes automatically. If issues persist:
- Check the Functions tab in Netlify dashboard
- Ensure `@sveltejs/adapter-netlify` is installed

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |

---

## Updating Your Deployment

Simply push to your main branch - Netlify auto-deploys on every push.

```bash
git add .
git commit -m "Update"
git push
```

---

## Cost Estimates (Free Tiers)

| Service | Free Tier Limits |
|---------|------------------|
| Supabase | 500MB database, 1GB storage, 50k MAU |
| Netlify | 100GB bandwidth, 300 build minutes/month |

Both free tiers are generous enough for thousands of users.
