# Velyto 3.0

Free, browser-first tools plus **Shop**, **Study**, **Business** and **Media** — one Next.js (App Router) app with an optional real account system on PostgreSQL.

## Run locally
```bash
npm install
cp .env.example .env     # set DATABASE_URL (optional for guest-mode tools)
npm run db:migrate       # 1-command migration (reads db/schema.sql)
npm run dev
```
The app also creates missing tables lazily at runtime, and **`npm run build` never touches the database**, so a missing `DATABASE_URL` cannot break a Netlify build.

## Deploy free on Netlify
1. Push the repo, import it in Netlify (build command `npm run build` — already in `netlify.toml`).
2. Create a free **Neon** or **Supabase** Postgres and add `DATABASE_URL` (with `?sslmode=require`) in *Site settings → Environment variables*.
3. Optional: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

## Structure
- `src/data/` — `tools.ts`, `exams.ts`, `guides.ts`, `hi-tools.ts`, tool content, business & currency data
- `src/components/tools/` — the 34 client-side tools (loaded with dynamic imports; pdf-lib and qrcode load only on click)
- `src/app/api/` — auth, shops, business docs, study sync, waitlist, requests, contact
- `db/schema.sql` — canonical schema (`npm run db:gen-ddl` regenerates `src/db/ddl.ts` after edits)
- `netlify.toml` — security headers incl. a CSP that allows `blob:` / `data:` for the media tools
