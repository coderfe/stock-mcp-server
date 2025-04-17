import axios from '@lib/axios/stock'

/**
 * 获取港股通成分股
 */
export async function fetchGGTStockList() {
  try {
    const res = await axios.get<HKStockData[]>('/stock_hk_ggt_components_em')
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
    const res = await axios.get<StockHistory[]>('/stock_hk_hist', {
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
 * 港股个股详情
 */
export async function fetchHKStockInfo(symbol: string) {
  try {
    const res = await axios.get<ItemValue[]>('/stock_individual_basic_info_hk_xq', {
      params: { symbol },
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
    const res = await axios.get<HKStockData[]>('/stock_hk_famous_spot_em')
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}
