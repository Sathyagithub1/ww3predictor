// PM2 process manager config for Hostinger Cloud
// Start with: pm2 start ecosystem.config.js
// Save process list: pm2 save
// Auto-start on reboot: pm2 startup

module.exports = {
  apps: [
    {
      name: "ww3predictor",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/u767522705/public_html/ww3predictor",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
