import axios from "@lib/axios/stock"
import { isMainBoardStock } from "@lib/utils"

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

/**
 * 单次获取指定 date 的财报发行, 提供港股的财报发行数据
 */
export async function fetchMarketEarningsRelease(date: string) {
  const res = await axios.get<MarketStockQuote[]>('/news_report_time_baidu', {
    params: { date },
    headers: {
      'use-cache': 'false',
    }
  })
  const isMain = (type: string) => ['SH', 'SZ'].includes(type)
  const data = res.data.filter(item => isMainBoardStock(item.股票代码) && isMain(item.交易所))
  return {
    [date]: data
  }
}

/**
 * 财经资讯
 */
export async function fetchMarketNews() {
  const res = await axios.get('/stock_info_global_em', {
    headers: {
      'use-cache': 'false',
    }
  })
  return res.data
}
