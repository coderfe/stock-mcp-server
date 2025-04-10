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
