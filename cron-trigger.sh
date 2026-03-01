#!/bin/bash
# WW3 Predictor — Cron trigger script
# Add to Hostinger cPanel Cron Jobs:
#   Schedule: Every 6 hours (0 */6 * * *)
#   Command: /bin/bash /home/YOUR_USERNAME/public_html/ww3predictor/cron-trigger.sh

curl -s -X POST https://ww3predictor.com/api/update-prediction \
  -H "Authorization: Bearer 5b8593ed05dc353f312480197f113f6481f7e465" \
  >> /home/u767522705/logs/ww3cron.log 2>&1
