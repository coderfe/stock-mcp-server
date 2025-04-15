import axios from "@lib/axios/stock"

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
  const res = await axios.get<IndexHistory[]>('/index_zh_a_hist', {
    params: { symbol, period, start_date: startDate, end_date: endDate },
  })
  return res.data
}

/**
 * 赚钱效应数据
 */
export async function fetchMarketProfitEffect() {
  const res = await axios.get<ItemValue[]>('/stock_market_activity_legu')
  return res.data
}
