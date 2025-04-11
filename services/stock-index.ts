import stockClient from "@lib/stockClient"

export type MarketWeeklyParams = {
  symbol: string
  period: 'daily' | 'weekly' | 'monthly'
  startDate: string
  endDate: string
}

/**
 * 大盘历史行情
 */
export async function fetchMarketWeeklyData({
  symbol,
  period,
  startDate,
  endDate,
}: MarketWeeklyParams) {
  const res = await stockClient.get<IndexHistory[]>('/index_zh_a_hist', {
    params: { symbol, period, start_date: startDate, end_date: endDate },
  })
  return res.data
}
