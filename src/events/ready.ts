import { Events } from 'discord.js'
import Event from '../templates/Event.js'
import { startGoldpriceDailyJob } from '../crons/goldprice.daily.js'

export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(): void {
        // Runs when the bot logs in
        console.log(`Logged in as ${client.user?.tag as string}!`)

        // Start cron jobs
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        startGoldpriceDailyJob()
    }
})
