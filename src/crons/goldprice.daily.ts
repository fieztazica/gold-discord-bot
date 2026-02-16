import { CronJob } from 'cron'
import { ChannelType, type TextChannel } from 'discord.js'
import { fetchGoldPrices } from '../apis/goldprice.js'
import createGoldPriceEmbed from '../embeds/goldprice.embed.js'

const { DEFAULT_GUILD_ID, CHANNEL_ID } = process.env as {
    DEFAULT_GUILD_ID: string
    CHANNEL_ID: string
}

export const goldpriceDaily = new CronJob(
    // Cron expression: 0 7 * * * = Every day at 7:00 AM
    '0 7 * * *',
    async () => {
        try {
            console.log('Running daily gold price job...')

            const data = await fetchGoldPrices('SJ9999', null, null)

            if (!data.success) {
                console.error('Failed to fetch gold prices from API')
                return
            }

            const embed = createGoldPriceEmbed(data)

            // Get the guild and channel
            const guild = await global.client.guilds.fetch(DEFAULT_GUILD_ID)
            if (!guild) {
                console.error(`Guild ${DEFAULT_GUILD_ID} not found`)
                return
            }

            const channel = await guild.channels.fetch(CHANNEL_ID)
            if (!channel || channel.type !== ChannelType.GuildText) {
                console.error(
                    `Channel ${CHANNEL_ID} not found or is not a text channel`
                )
                return
            }

            // Send the embed to the channel
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            await (channel as TextChannel).send({
                embeds: [embed]
            })

            console.log(`Daily gold price sent to ${channel.name}`)
        } catch (error) {
            console.error('Error in goldprice daily job:', error)
        }
    },
    null,
    false, // Start: false, we'll start it manually
    'Asia/Ho_Chi_Minh' // Timezone: Ho Chi Minh
)

export function startGoldpriceDailyJob(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    goldpriceDaily.start()
    console.log('Daily gold price job started')
}

export function stopGoldpriceDailyJob(): void {
    void goldpriceDaily.stop()
    console.log('Daily gold price job stopped')
}
