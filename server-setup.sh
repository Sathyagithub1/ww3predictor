#!/bin/bash
# WW3 Predictor — One-shot server setup for Hostinger Cloud
# Run this after SSHing in: bash server-setup.sh

set -e
echo "=== WW3 Predictor Server Setup ==="

# ── 1. Install PM2 globally ──────────────────────────────────────────────────
echo "[1/6] Installing PM2..."
npm install -g pm2

# ── 2. Create project directory ──────────────────────────────────────────────
echo "[2/6] Creating project directory..."
mkdir -p ~/public_html/ww3predictor
mkdir -p ~/logs

# ── 3. Clone from GitHub (after you've pushed) ───────────────────────────────
echo "[3/6] Cloning from GitHub..."
cd ~/public_html
if [ -d "ww3predictor/.git" ]; then
  echo "Repo already exists, pulling latest..."
  cd ww3predictor && git pull origin main
else
  git clone https://github.com/Sathyagithub1/ww3predictor.git
  cd ww3predictor
fi

# ── 4. Write .env.local ───────────────────────────────────────────────────────
echo "[4/6] Writing environment variables..."
cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=https://qgmqbglmpuqmuhkwgtxi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEWSAPI_KEY=YOUR_NEWSAPI_KEY
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
CRON_SECRET=YOUR_CRON_SECRET
NEXT_PUBLIC_ADSENSE_ID=
WORDPRESS_BLOG_URL=https://blog.ww3predictor.com
NEXT_PUBLIC_SITE_URL=https://ww3predictor.com
ENVEOF

# ── 5. Install deps & build ───────────────────────────────────────────────────
echo "[5/6] Installing dependencies & building..."
npm install
npm run build

# ── 6. Start with PM2 ────────────────────────────────────────────────────────
echo "[6/6] Starting app with PM2..."
pm2 stop ww3predictor 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup 2>/dev/null | tail -1 || true

echo ""
echo "✅ Setup complete!"
echo "   App running on port 3000"
echo "   Check status: pm2 status"
echo "   Check logs:   pm2 logs ww3predictor"
echo ""
echo "⚡ Seed first prediction:"
echo "   curl -X POST http://localhost:3000/api/update-prediction -H 'Authorization: Bearer 5b8593ed05dc353f312480197f113f6481f7e465'"
