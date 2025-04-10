import stockClient from "../lib/stockClient"

/**
 * 获取涨停股池
 */
export async function fetchLimitUpPool(date: string) {
  try {
    const res = await stockClient.get<LimitUpStock[]>('/stock_zt_pool_em', {
      params: { date },
    })
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}

/**
 * 获取强势股池
 */
export async function fetchStrongStockPool(date: string) {
  try {
    const res = await stockClient.get<StrongStock[]>('/stock_zt_pool_strong_em', {
      params: { date },
    })
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}
