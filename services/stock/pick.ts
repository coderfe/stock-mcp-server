import axios from '@lib/axios/stock'
import { isMainBoardStock, isST } from '@lib/utils'
import { z } from 'zod'

// export const ProviderEnum = z.enum(['deepseek', 'kimi'])
// type Provider = z.infer<typeof ProviderEnum>

export const NewHighEnum = z.enum(['创月新高', '半年新高', '一年新高', '历史新高'])
export type NewHigh = z.infer<typeof NewHighEnum>
/**
 * 创新高股票
 */
export async function fetchNewHighStocks(symbol: NewHigh) {
  const res = await axios.get<ChuangXinGao[]>('/stock_rank_cxg_ths', {
    params: { symbol },
  })
  return res.data.filter((i) => isMainBoardStock(i.股票代码) && !isST(i.股票简称))
}

/**
 * 量价齐升股票
 */
export async function fetchVolumePriceStocks() {
  const res = await axios.get<LiangJiaQiSheng[]>('/stock_rank_ljqs_ths')
  return res.data.filter((i) => isMainBoardStock(i.股票代码) && !isST(i.股票简称))
}

/**
 * 连续上涨股票
 */
export async function fetchContinuousRiseStocks() {
  const res = await axios.get<LianXuShangZhang[]>('/stock_rank_lxsz_ths')
  return res.data.filter((i) => isMainBoardStock(i.股票代码) && !isST(i.股票简称))
}

/**
 * 持续放量
 */
export async function fetchContinuousVolumeStocks() {
  const res = await axios.get<ChiXuFangLiang[]>('/stock_rank_cxfl_ths')
  return res.data.filter((i) => isMainBoardStock(i.股票代码) && !isST(i.股票简称))
}
