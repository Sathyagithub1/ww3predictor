# WW3 Predictor — Setup Guide

## Prerequisites
- Node.js 18+ installed (https://nodejs.org)
- A Vercel account (free) — https://vercel.com
- A Supabase account (free) — https://supabase.com
- NewsAPI key (free, 100 req/day) — https://newsapi.org
- Anthropic API key — https://console.anthropic.com

---

## Step 1: Install Dependencies

```bash
cd ww3predictor
npm install
```

---

## Step 2: Set Up Supabase

1. Go to https://app.supabase.com → New Project
2. Choose a name (e.g. `ww3predictor`), set a strong database password
3. Once created, go to **SQL Editor → New Query**
4. Paste the contents of `supabase-schema.sql` and run it
5. Go to **Project Settings → API** and copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3: Get NewsAPI Key

1. Go to https://newsapi.org → Get API Key (free)
2. Copy the key → `NEWSAPI_KEY`

> **Note:** Free tier = 100 requests/day. With 6-hour cron (4 req/day) + news page visits cached for 1 hour, this is fine.

---

## Step 4: Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Create an account → API Keys → Create Key
3. Copy the key → `ANTHROPIC_API_KEY`

> **Cost:** ~$0.01 per 6-hour update cycle (very cheap)

---

## Step 5: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEWSAPI_KEY=your-newsapi-key
ANTHROPIC_API_KEY=sk-ant-your-key
CRON_SECRET=your-random-32-char-string   # generate with: openssl rand -hex 16
NEXT_PUBLIC_ADSENSE_ID=                  # leave blank until AdSense approved
WORDPRESS_BLOG_URL=https://blog.ww3predictor.com
```

---

## Step 6: Run Locally

```bash
npm run dev
```

Open http://localhost:3000

### Seed the first prediction manually

With the dev server running:

```bash
curl -X POST http://localhost:3000/api/update-prediction \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or visit: `http://localhost:3000/api/update-prediction?secret=YOUR_CRON_SECRET`

---

## Step 7: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Then add all environment variables in the Vercel dashboard:
**Project → Settings → Environment Variables**

Add every variable from `.env.local`.

Also add:
```
NEXT_PUBLIC_SITE_URL=https://ww3predictor.com
```

### Enable Vercel Cron

The `vercel.json` already configures the cron job:
```json
{
  "crons": [{ "path": "/api/update-prediction", "schedule": "0 */6 * * *" }]
}
```

Vercel automatically sends `Authorization: Bearer $CRON_SECRET` to your endpoint.

> **Note:** Vercel Cron requires a Pro plan OR the hobby plan allows 1 cron job.

---

## Step 8: Point Your Domain

1. In Vercel: **Project → Domains → Add ww3predictor.com**
2. Update your domain registrar's DNS to Vercel's nameservers

---

## Step 9: Google AdSense

1. Apply at https://adsense.google.com
2. Add your site URL
3. Add the AdSense verification code (Vercel will auto-deploy)
4. Once approved, get your publisher ID and set:
   ```
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXXX
   ```
5. Add the ad slot IDs in the `AdSlot` component calls in your pages

---

## Step 10: Google News Inclusion

1. Submit sitemap at https://search.google.com/search-console
2. Add property → verify via DNS TXT record
3. Submit `https://ww3predictor.com/sitemap.xml`
4. For Google News inclusion, apply at https://publishercenter.google.com

---

## File Structure

```
ww3predictor/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Home — threat meter
│   ├── news/page.tsx       # News grid
│   ├── blogs/page.tsx      # WordPress embed
│   ├── about/page.tsx
│   ├── privacy/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       ├── prediction/route.ts         # GET latest score
│       ├── update-prediction/route.ts  # POST (cron endpoint)
│       └── news/route.ts               # GET news proxy
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PredictorMeter.tsx   # SVG arc gauge
│   ├── ThreatFactors.tsx
│   ├── NewsTicker.tsx
│   ├── NewsCard.tsx
│   └── AdSlot.tsx
├── lib/
│   ├── supabase.ts
│   ├── claude.ts
│   └── newsapi.ts
├── public/
│   ├── sitemap.xml
│   └── robots.txt
├── supabase-schema.sql      # Run in Supabase SQL Editor
├── vercel.json              # Cron config
└── .env.local.example
```
