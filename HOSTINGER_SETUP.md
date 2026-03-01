# WW3 Predictor — Hostinger Cloud Startup Deployment Guide

## Prerequisites
- Hostinger Cloud Startup plan with SSH access
- GitHub account + repo
- Node.js 18+ (pre-installed on Hostinger Cloud)
- PM2 installed globally

---

## Step 1: SSH into Your Hostinger Server

In Hostinger hPanel → Advanced → SSH Access:
- Copy your SSH hostname (e.g. `srv12345.hstgr.cloud`)
- SSH username and password

```bash
ssh username@srv12345.hstgr.cloud
```

---

## Step 2: Install PM2 Globally

```bash
npm install -g pm2
```

---

## Step 3: Clone Your GitHub Repo

```bash
cd ~/public_html
git clone https://github.com/YOUR_USERNAME/ww3predictor.git
cd ww3predictor
```

---

## Step 4: Set Up Environment Variables on Server

```bash
nano .env.local
```

Paste and fill in all values (use the `.env.local.example` as reference):

```env
NEXT_PUBLIC_SUPABASE_URL=https://pcerskbgrueuzhxdgjgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEWSAPI_KEY=your-newsapi-key
ANTHROPIC_API_KEY=sk-ant-...
CRON_SECRET=your-random-secret
NEXT_PUBLIC_SITE_URL=https://ww3predictor.com
WORDPRESS_BLOG_URL=https://blog.ww3predictor.com
```

Save: `Ctrl+X → Y → Enter`

---

## Step 5: Install Dependencies & Build

```bash
npm install
npm run build
```

---

## Step 6: Run Supabase Schema

1. Go to https://app.supabase.com → your project (pcerskbgrueuzhxdgjgb)
2. SQL Editor → New Query
3. Paste contents of `supabase-schema.sql` → Run

---

## Step 7: Start the App with PM2

Edit `ecosystem.config.js` — replace `YOUR_HOSTINGER_USERNAME` with your actual username:

```bash
nano ecosystem.config.js
```

Then start:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the command it outputs to auto-start on reboot
```

Check it's running:
```bash
pm2 status
pm2 logs ww3predictor
```

---

## Step 8: Set Up Nginx Reverse Proxy (Port 3000 → Port 80/443)

In Hostinger hPanel → Hosting → Manage → Advanced → .htaccess OR via Nginx config:

If Hostinger provides Nginx config access, add:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Alternatively, use Hostinger's **Node.js Application** feature in hPanel which handles this automatically.

---

## Step 9: Set Up Cron Job in Hostinger cPanel

1. In hPanel → Advanced → Cron Jobs
2. Edit `cron-trigger.sh`:
   - Replace `YOUR_USERNAME` with your SSH username
   - Replace `YOUR_CRON_SECRET_HERE` with your CRON_SECRET value
3. Upload the script and make it executable:

```bash
chmod +x ~/public_html/ww3predictor/cron-trigger.sh
mkdir -p ~/logs
```

4. In cPanel Cron Jobs, add:
   - **Minute:** 0
   - **Hour:** */6
   - **Day:** *
   - **Month:** *
   - **Weekday:** *
   - **Command:** `/bin/bash /home/YOUR_USERNAME/public_html/ww3predictor/cron-trigger.sh`

---

## Step 10: Set Up GitHub Actions Auto-Deploy

In your GitHub repo → Settings → Secrets and Variables → Actions → New Repository Secret:

| Secret Name | Value |
|---|---|
| `SSH_HOST` | Your Hostinger SSH hostname |
| `SSH_USERNAME` | Your SSH username |
| `SSH_PASSWORD` | Your SSH password |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pcerskbgrueuzhxdgjgb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://ww3predictor.com` |
| `NEXT_PUBLIC_ADSENSE_ID` | (leave blank for now) |

Now every `git push` to `main` will auto-build and deploy.

---

## Step 11: Point Domain to Hostinger

In Hostinger hPanel → Domains → point `ww3predictor.com` to your cloud server IP.

Enable **SSL/TLS** (free Let's Encrypt) in hPanel → SSL.

---

## Step 12: Seed First Prediction

Once live, trigger the first prediction manually:

```bash
curl -X POST https://ww3predictor.com/api/update-prediction \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or via SSH on the server:
```bash
cd ~/public_html/ww3predictor
bash cron-trigger.sh
```

---

## Useful PM2 Commands

```bash
pm2 status                  # check app status
pm2 logs ww3predictor       # view live logs
pm2 restart ww3predictor    # restart after code changes
pm2 stop ww3predictor       # stop app
```
