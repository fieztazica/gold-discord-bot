import { EmbedBuilder } from 'discord.js'
import { GoldPriceApiResponse, PriceData } from '../apis/goldprice.js'

export default function createGoldPriceEmbed(
    data: GoldPriceApiResponse
): EmbedBuilder {
    const formatPrice = (price: number, currency: string) => {
        if (currency === 'VND') {
            return `${(price / 1000000).toFixed(2)}M`
        }
        return price.toFixed(2)
    }

    const formatPriceData = (item: PriceData) => {
        return `💰 ${formatPrice(item.buy, item.currency)} | 📊 ${formatPrice(
            item.sell,
            item.currency
        )} | 📈 ${item.change_buy > 0 ? '+' : ''}${formatPrice(
            item.change_buy,
            item.currency
        )}`
    }

    const emojiLegend = '💰 = Buy | 📊 = Sell | 📈 = Change'

    const embed = new EmbedBuilder().setColor(0xffd700) // Gold color

    if (data.timestamp) {
        embed.setTimestamp(new Date(data.timestamp * 1000))
    }

    // Single type response
    if (data.name && data.type) {
        embed
            .setTitle(`Gold Price - ${data.type}`)
            .setDescription(`${data.name}`)
            .addFields(
                {
                    name: '💰 Buy Price',
                    value: `${formatPrice(data.buy!, 'VND')}`,
                    inline: true
                },
                {
                    name: '📊 Sell Price',
                    value: `${formatPrice(data.sell!, 'VND')}`,
                    inline: true
                },
                {
                    name: '📈 Change Buy',
                    value: `${data.change_buy! > 0 ? '+' : ''}${formatPrice(
                        data.change_buy!,
                        'VND'
                    )}`,
                    inline: true
                },
                {
                    name: '📉 Change Sell',
                    value: `${data.change_sell! > 0 ? '+' : ''}${formatPrice(
                        data.change_sell!,
                        'VND'
                    )}`,
                    inline: true
                }
            )
    }
    // Multiple prices response
    else if (data.prices) {
        embed
            .setTitle('Gold Prices')
            .setDescription(
                `Updated: ${data.date} ${data.time}\n\n${emojiLegend}`
            )

        for (const [typeCode, priceData] of Object.entries(data.prices)) {
            const priceInfo = formatPriceData(priceData)
            embed.addFields({
                name: `${typeCode} - ${priceData.name}`,
                value: priceInfo,
                inline: false
            })
        }
    }

    embed.setFooter({ text: `Last updated: ${data.date} ${data.time}` })

    return embed
}
