import stockClient from '../lib/stockClient'

/**
 * 获取港股通成分股
 */
export async function fetchGGTStockList() {
  try {
    const res = await stockClient.get<HKStockData[]>('/stock_hk_ggt_components_em')
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}

/**
 * 港股个股历史行情数据
 */
export async function fetchHKStockHistory({
  symbol,
  startDate,
  endDate,
}: HistoryParams) {
  try {
    const res = await stockClient.get<StockHistory[]>('/stock_hk_hist', {
      params: {
        symbol,
        start_date: startDate,
        end_date: endDate,
        period: 'daily'
      },
    })
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}

/**
 * 优质港股个股
 */
export async function fetchHKFamousStocks() {
  try {
    const res = await stockClient.get<HKStockData[]>('/stock_hk_famous_spot_em')
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}
