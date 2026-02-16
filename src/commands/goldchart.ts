import {
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
    EmbedBuilder,
    type AutocompleteInteraction
} from 'discord.js'
import QuickChart from 'quickchart-js'
import { fetchGoldPrices, VALID_GOLD_TYPES } from '../apis/goldprice.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('goldchart')
        .setDescription('Generate a chart for gold price history')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription(
                    'Gold type code (e.g., SJL1L10, SJ9999) - Default: SJ9999'
                )
                .setRequired(false)
                .setAutocomplete(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('days')
                .setDescription('Number of days for historical data (1-30)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(30)
        ) as SlashCommandBuilder,
    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedOption = interaction.options.getFocused(true)

        if (focusedOption.name === 'type') {
            const focusedValue = focusedOption.value

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
        }
    },
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply()

        const type = interaction.options.getString('type') ?? 'SJ9999'
        const days = interaction.options.getInteger('days') ?? 30

        try {
            const data = await fetchGoldPrices(type, days, null)

            if (!data.success || !data.history || data.history.length === 0) {
                await interaction.editReply({
                    content:
                        '❌ Failed to fetch historical gold price data from API'
                })
                return
            }

            // Extract dates and prices for the chart
            const dates: string[] = []
            const buyPrices: number[] = []
            const sellPrices: number[] = []

            for (const historyItem of data.history) {
                dates.push(historyItem.date)
                const priceData = historyItem.prices[type]
                if (priceData) {
                    buyPrices.push(priceData.buy / 1000000) // Convert to millions
                    sellPrices.push(priceData.sell / 1000000)
                }
            }

            // Reverse to show oldest to newest
            dates.reverse()
            buyPrices.reverse()
            sellPrices.reverse()

            // Create chart using QuickChart
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const chart = new (QuickChart as any)()
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            chart.setConfig({
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Buy Price (M)',
                            data: buyPrices,
                            borderColor: '#FFD700',
                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Sell Price (M)',
                            data: sellPrices,
                            borderColor: '#FFA500',
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Gold Price History - ${type} (${days} days)`
                        },
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Price (Million VND)'
                            }
                        }
                    }
                }
            })

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const chartUrl = chart.getUrl()

            // Create embed with chart
            const embed = new EmbedBuilder()
                .setColor(0xffd700)
                .setTitle(
                    `Gold Price History - ${type} (${data.history.length} days)`
                )
                .setDescription(
                    `${VALID_GOLD_TYPES[type as keyof typeof VALID_GOLD_TYPES]}`
                )
                .setImage(chartUrl)

            await interaction.editReply({
                embeds: [embed]
            })
        } catch (error) {
            console.error('Error generating gold price chart:', error)
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
