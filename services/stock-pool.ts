import axios from "@lib/axios/stock"

/**
 * 获取涨停股池
 */
export async function fetchLimitUpPool(date: string) {
  try {
    const res = await axios.get<LimitUpStock[]>('/stock_zt_pool_em', {
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
    const res = await axios.get<StrongStock[]>('/stock_zt_pool_strong_em', {
      params: { date },
    })
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}
