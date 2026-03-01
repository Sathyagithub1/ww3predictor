#!/bin/bash
# WW3 Predictor — One-shot server setup for Hostinger Cloud
# Run this after SSHing in: bash server-setup.sh
# IMPORTANT: Fill in your actual values in .env.local after running this script

set -e
echo "=== WW3 Predictor Server Setup ==="

# ── 1. Install PM2 globally ──────────────────────────────────────────────────
echo "[1/6] Installing PM2..."
npm install -g pm2

# ── 2. Create project directory ──────────────────────────────────────────────
echo "[2/6] Creating project directory..."
mkdir -p ~/domains/ww3predictor.com/app
mkdir -p ~/logs

# ── 3. Clone from GitHub (after you've pushed) ───────────────────────────────
echo "[3/6] Cloning from GitHub..."
cd ~/domains/ww3predictor.com
if [ -d "app/.git" ]; then
  echo "Repo already exists, pulling latest..."
  cd app && git pull origin main
else
  git clone https://github.com/Sathyagithub1/ww3predictor.git app
  cd app
fi

# ── 4. Write .env.local ───────────────────────────────────────────────────────
echo "[4/6] Writing environment variables..."
# Copy the example file and fill in your values
cp .env.local.example .env.local
echo ""
echo "⚠️  Edit .env.local and fill in your actual API keys before building:"
echo "    nano .env.local"
echo ""
echo "Required keys:"
echo "  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  SUPABASE_SERVICE_ROLE_KEY, NEWSAPI_KEY, ANTHROPIC_API_KEY"
echo "  CRON_SECRET, NEXT_PUBLIC_SITE_URL"
echo ""
read -p "Press Enter after you have edited .env.local..."

# ── 5. Install deps & build ───────────────────────────────────────────────────
echo "[5/6] Installing dependencies & building..."
npm install
JEST_WORKER_FORCE_MAIN_THREAD=1 npm run build

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
