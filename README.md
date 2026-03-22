# Gold Price Watcher Discord Bot

> This bot is vibe-coded and is built using the [Typescript Discord.js v14 Template](https://github.com/OfficialDelta/Typescript-Discord.js-v14-Template).

This is a Discord bot that provides daily updates on gold prices. It fetches gold price data from an API and posts it in a specified Discord channel at scheduled times.

## PM2 Deployment Guide

For instructions on how to deploy this bot using PM2, please refer to the [PM2 Deployment Guide](PM2_DEPLOYMENT.md).

## Features

-   Daily gold price updates at specified times
-   Configurable gold price API and scheduling
-   Easy deployment with PM2

## Configuration

The bot can be configured using the `config.json` file. Here are the available options:

-   `prefix`: The command prefix for the bot (default: `!`)
-   `goldPriceCron`: The cron expression for scheduling gold price updates (e.g., `0 7,19 * * *` for 7 AM and 7 PM daily)
-   `goldPriceTimezone`: The timezone for scheduling the cron job (e.g., `Asia/Ho_Chi_Minh`)
-   `goldPriceId`: The ID for fetching gold price data from the API (e.g., `SJ9999`)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
