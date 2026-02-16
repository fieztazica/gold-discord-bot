import type { Message } from 'discord.js'
import { fetchGoldPrices } from '../apis/goldprice.js'
import createGoldPriceEmbed from '../embeds/goldprice.embed.js'
import MessageCommand from '../templates/MessageCommand.js'

export default new MessageCommand({
    name: 'goldprice',
    description: 'Fetch current gold prices from vang.today API',
    aliases: ['gp', 'gold'],
    async execute(message: Message, args: string[]): Promise<void> {
        // Parse arguments: type
        // Format: !goldprice [type]
        // Example: !goldprice SJL1L10

        const type = args[0] || null

        try {
            const data = await fetchGoldPrices(type, null, null)

            if (!data.success) {
                await message.reply({
                    content: '❌ Failed to fetch gold prices from API'
                })
                return
            }

            const embed = createGoldPriceEmbed(data)

            await message.reply({
                embeds: [embed]
            })
        } catch (error) {
            console.error('Error fetching gold prices:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred'
            await message.reply({
                content: `❌ ${errorMessage}`
            })
        }
    }
})
