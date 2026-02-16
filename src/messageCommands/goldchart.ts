import type { Message } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import QuickChart from 'quickchart-js'
import { fetchGoldPrices, VALID_GOLD_TYPES } from '../apis/goldprice.js'
import MessageCommand from '../templates/MessageCommand.js'

export default new MessageCommand({
    name: 'goldchart',
    description: 'Generate a chart for gold price history',
    aliases: ['gc', 'chart'],
    async execute(message: Message, args: string[]): Promise<void> {
        // Format: !goldchart [type] [days]
        // Example: !goldchart SJ9999 7
        // Defaults: type=SJ9999, days=7

        const type = args[0] ?? 'SJ9999'
        const days = args[1] ? parseInt(args[1]) : 30

        // Validate days
        if (isNaN(days) || days < 1 || days > 30) {
            await message.reply({
                content: '❌ Days parameter must be a number between 1 and 30'
            })
            return
        }

        try {
            const data = await fetchGoldPrices(type, days, null)

            if (!data.success || !data.history || data.history.length === 0) {
                await message.reply({
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

            await message.reply({
                embeds: [embed]
            })
        } catch (error) {
            console.error('Error generating gold price chart:', error)
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
