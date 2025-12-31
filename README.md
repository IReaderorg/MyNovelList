# MyNovelList

Track any novel, manga, or reading material. No limits, no restrictions.

## Features

- **Add Anything**: No database limitations. Add any novel manually with title, cover, and source
- **Track Progress**: Manual chapter tracking with scores from 1-100
- **Share Tier Lists**: Create and share tier lists with the community
- **Guest Mode**: Works without an account using localStorage
- **Export/Import**: Backup your data as JSON

## Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel

## Getting Started

### 1. Clone and Install

```bash
cd novel-tracker
npm install
```

Then:
1. Create a Supabase project at supabase.com
2. Run the SQL in `supabase/migrations/001_initial_schema.sql`
3. Copy `.env.example` to `.env` and add your Supabase credentials
4. Run `npm run dev`

Open [http://localhost:5173](http://localhost:5173)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
novel-tracker/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── services/       # API services
│   │   ├── stores/         # Svelte stores
│   │   └── types/          # TypeScript types
│   └── routes/             # SvelteKit routes
├── supabase/
│   └── migrations/         # Database schema
└── static/                 # Static assets
```

## License

MIT
