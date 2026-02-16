# PM2 Deployment Guide

This guide explains how to deploy the Discord bot using PM2.

## Prerequisites

-   Node.js (v18+)
-   npm or bun
-   PM2 installed globally: `npm install -g pm2`

## Installation Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Setup PM2 startup script (optional but recommended)
pm2 startup
```

## Starting the Bot

### Start with PM2

```bash
# Start the bot
pm2 start ecosystem.config.js

# Start with a specific app name
pm2 start ecosystem.config.js --name "gold-discord-bot"
```

### Monitor the Bot

```bash
# View logs
pm2 logs gold-discord-bot

# View real-time monitoring
pm2 monit

# Show status
pm2 status
```

### Stop/Restart the Bot

```bash
# Stop the bot
pm2 stop gold-discord-bot

# Restart the bot
pm2 restart gold-discord-bot

# Delete from PM2
pm2 delete gold-discord-bot
```

## Important Notes

### Environment Variables

-   Make sure your `.env` file is in the project root
-   The ecosystem.config.js automatically loads variables from `.env`
-   Required variables:
    -   `TOKEN` - Discord bot token
    -   `CLIENT_ID` - Discord application ID
    -   `OWNER_ID` - Bot owner's Discord ID
    -   `DEFAULT_GUILD_ID` - Default guild for features
    -   `CHANNEL_ID` - Channel for daily gold price updates

### Logging

-   Output logs: `./logs/out.log`
-   Error logs: `./logs/error.log`
-   Make sure the `logs/` directory exists or PM2 will create it

### Auto-restart Configuration

-   **autorestart**: Automatically restarts if bot crashes
-   **max_memory_restart**: Restarts if memory usage exceeds 300MB
-   **kill_timeout**: Graceful shutdown timeout (5 seconds)

## Useful PM2 Commands

```bash
# Save PM2 process list
pm2 save

# Resurrect saved processes on reboot
pm2 resurrect

# Delete all PM2 processes
pm2 delete all

# Dump configuration
pm2 dump

# Show process info
pm2 info gold-discord-bot

# Watch for file changes (requires watch enabled in config)
pm2 watch
```

## Production Deployment

For production:

1. Update `.env` with production values
2. Build the project: `npm run build`
3. Start with PM2: `pm2 start ecosystem.config.js --env production`
4. Save processes: `pm2 save`
5. Enable startup on boot: `pm2 startup`

## Troubleshooting

### Bot won't start

-   Check logs: `pm2 logs gold-discord-bot`
-   Verify `.env` file exists and has correct values
-   Ensure Discord token is valid

### Memory issues

-   Increase `max_memory_restart` in ecosystem.config.js
-   Monitor with: `pm2 monit`

### Logs not appearing

-   Ensure `logs/` directory exists
-   Check file permissions
-   Verify log paths in ecosystem.config.js

## Monitoring with Restart on Crash

The current configuration includes:

-   Auto-restart on crash
-   Memory limit monitoring (300MB)
-   Graceful shutdown (5 second timeout)
-   Error logging to separate file

This ensures your Discord bot stays online reliably in production!
