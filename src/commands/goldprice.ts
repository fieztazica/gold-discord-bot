import {
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
    type AutocompleteInteraction
} from 'discord.js'
import { fetchGoldPrices, VALID_GOLD_TYPES } from '../apis/goldprice.js'
import createGoldPriceEmbed from '../embeds/goldprice.embed.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('goldprice')
        .setDescription('Fetch current gold prices from vang.today API')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription(
                    'Gold type code (e.g., XAUUSD, SJL1L10, SJ9999)'
                )
                .setRequired(false)
                .setAutocomplete(true)
        ) as SlashCommandBuilder,
    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedValue = interaction.options.getFocused(true).value

        const choices = Object.entries(VALID_GOLD_TYPES).map(
            ([code, name]) => ({
                name: `${code} - ${name}`,
                value: code
            })
        )

        const filtered = choices.filter((choice) =>
            choice.value
                .toLowerCase()
                .startsWith(focusedValue.toString().toLowerCase())
        )

        await interaction.respond(filtered.slice(0, 25)) // Discord limits to 25 choices
    },
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply()

        const type = interaction.options.getString('type')

        try {
            const data = await fetchGoldPrices(type, null, null)

            if (!data.success) {
                await interaction.editReply({
                    content: '❌ Failed to fetch gold prices from API'
                })
                return
            }

            const embed = createGoldPriceEmbed(data)

            await interaction.editReply({
                embeds: [embed]
            })
        } catch (error) {
            console.error('Error fetching gold prices:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred'
            await interaction.editReply({
                content: `❌ ${errorMessage}`
            })
        }
    }
})
