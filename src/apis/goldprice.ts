import { inlineCode } from 'discord.js'

export const API_BASE_URL = 'https://www.vang.today/api/prices'

export const VALID_GOLD_TYPES = {
    XAUUSD: 'Vàng Thế Giới (XAU/USD)',
    SJL1L10: 'SJC 9999',
    SJ9999: 'Nhẫn SJC',
    DOHNL: 'DOJI Hà Nội',
    DOHCML: 'DOJI HCM',
    DOJINHTV: 'DOJI Nữ Trang',
    BTSJC: 'Bảo Tín SJC',
    BT9999NTT: 'Bảo Tín 9999',
    PQHNVM: 'PNJ Hà Nội',
    PQHN24NTT: 'PNJ 24K',
    VNGSJC: 'VN Gold SJC',
    VIETTINMSJC: 'Viettin SJC'
}

export interface PriceData {
    name: string
    buy: number
    sell: number
    change_buy: number
    change_sell: number
    currency: string
}

export interface HistoryPriceData {
    name: string
    buy: number
    sell: number
    day_change_buy: number
    day_change_sell: number
    updates: number
}

export interface HistoryData {
    date: string
    prices: Record<string, HistoryPriceData>
}

export interface GoldPriceApiResponse {
    success: boolean
    timestamp?: number
    time?: string
    date?: string
    count?: number
    type?: string
    name?: string
    buy?: number
    sell?: number
    change_buy?: number
    change_sell?: number
    prices?: Record<string, PriceData>
    days?: number
    history?: HistoryData[]
}

export async function fetchGoldPrices(
    type?: string | null,
    days?: number | null,
    action?: string | null
): Promise<GoldPriceApiResponse> {
    // Validate that type is provided if days is specified
    if (days && !type) {
        throw new Error(
            `${inlineCode('type')} parameter is required when ${inlineCode(
                'days'
            )} is specified`
        )
    }

    // Validate type parameter
    if (type && !VALID_GOLD_TYPES[type as keyof typeof VALID_GOLD_TYPES]) {
        throw new Error(
            `Invalid gold type: ${inlineCode(
                type
            )}. Valid types are: ${Object.keys(VALID_GOLD_TYPES)
                .map((i) => inlineCode(i))
                .join(', ')}`
        )
    }

    let url = API_BASE_URL

    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (days) params.append('days', days.toString())
    if (action) params.append('action', action)

    if (params.toString()) {
        url += `?${params.toString()}`
    }

    const response = await fetch(url)
    const data: GoldPriceApiResponse =
        (await response.json()) as GoldPriceApiResponse
    console.log('Fetched gold prices:', data)
    return data
}
