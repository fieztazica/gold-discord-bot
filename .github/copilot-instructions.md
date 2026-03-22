# AI Coding Agent Instructions for Gold Price Discord Bot

## Project Overview

This is a Discord bot built with discord.js v14 and TypeScript that fetches gold price data from the vang.today API and provides daily updates via cron jobs. It supports both slash commands and legacy message commands.

## Architecture

-   **Main Entry**: `src/index.ts` - Initializes client, loads commands/events, deploys slash commands
-   **Commands**: Slash commands in `src/commands/`, message commands in `src/messageCommands/`
-   **Subcommands**: Organized in `src/subCommands/` with folder structure (e.g., `subcommandtest/test.ts`)
-   **Events**: Handled in `src/events/` (e.g., `ready.ts` starts cron jobs)
-   **APIs**: Gold price fetching in `src/apis/goldprice.ts`
-   **Embeds**: Rich responses in `src/embeds/` (e.g., `goldprice.embed.ts`)
-   **Cron Jobs**: Daily updates in `src/crons/goldprice.daily.ts`
-   **Templates**: Reusable classes in `src/templates/` for commands, events, subcommands

## Key Patterns

-   **Command Structure**: Use `ApplicationCommand` template with `data` (SlashCommandBuilder), `execute`, and optional `autocomplete`
-   **Subcommands**: Set `hasSubCommands: true` in parent command; subcommands auto-loaded from `src/subCommands/{commandName}/`
-   **Error Handling**: Defer replies, catch errors, respond with user-friendly messages
-   **API Calls**: Use `fetchGoldPrices(type?, days?, action?)` from `src/apis/goldprice.ts`
-   **Embeds**: Create with `createGoldPriceEmbed(data)` for consistent formatting
-   **Global Client**: Access via `global.client` (extended with commands collections)

## Development Workflow

-   **Local Dev**: `npm run dev` (compiles with tsc-watch, runs from dist/)
-   **Build**: `npm run build` (lint + prettier + compile)
-   **Production**: `npm run prod` (build + start) or use PM2 with `ecosystem.config.cjs`
-   **Command Deployment**: Slash commands auto-deployed globally on bot start via `src/deployGlobalCommands.ts`

## Configuration

-   **Config File**: `src/config.json` for cron schedule, timezone, default gold type
-   **Environment**: `.env` with `TOKEN`, `CLIENT_ID`, `DEFAULT_GUILD_ID`, `CHANNEL_ID`
-   **Valid Gold Types**: See `VALID_GOLD_TYPES` in `src/apis/goldprice.ts` (e.g., 'SJ9999', 'XAUUSD')

## Adding Features

-   **New Slash Command**: Create in `src/commands/`, export default `new ApplicationCommand({...})`
-   **New Subcommand**: Add to `src/subCommands/{parentCommand}/` as `new SubCommand({...})`
-   **New Event**: Create in `src/events/`, export default `new Event({...})`
-   **New API**: Add to `src/apis/`, export functions for data fetching
-   **New Embed**: Create in `src/embeds/`, export function returning `EmbedBuilder`

## Code Quality

-   **Linting**: `npm run lint` (ESLint with TypeScript)
-   **Formatting**: `npm run prettier` (Prettier)
-   **TypeScript**: Strict mode, ES modules (`"type": "module"` in package.json)
-   **Imports**: Use relative paths for internal modules, absolute for node_modules

## Deployment

-   Use PM2 for production: `pm2 start ecosystem.config.cjs`
-   Logs in `./logs/`, auto-restart on crash, memory limits
-   Cron jobs run in configured timezone (`config.goldPriceTimezone`)</content>
    <parameter name="filePath">d:\Projects\gold-discord-bot\.github\copilot-instructions.md
