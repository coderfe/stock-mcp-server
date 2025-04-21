import axios from "@lib/axios/stock"
import { ONE_YEAR } from "@lib/redis"

/**
 * 获取涨停股池
 */
export async function fetchLimitUpPool(date: string) {
  try {
    const res = await axios.get<LimitUpStock[]>('/stock_zt_pool_em', {
      params: { date },
      headers: {
        'cache-duration': date ? ONE_YEAR : undefined,
        'cache-key': date ? date : ''
      }
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
