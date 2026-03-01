#!/bin/bash
# WW3 Predictor — Cron trigger script
# Add to Hostinger cPanel Cron Jobs:
#   Schedule: Every 6 hours (0 */6 * * *)
#   Command: /bin/bash /home/YOUR_USERNAME/public_html/ww3predictor/cron-trigger.sh

curl -s -X POST https://ww3predictor.com/api/update-prediction \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE" \
  >> /home/YOUR_USERNAME/logs/ww3cron.log 2>&1
