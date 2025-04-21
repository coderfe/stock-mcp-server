import axios from '@lib/axios/stock'
import dayjs from '@lib/dayjs'
import { ONE_YEAR } from '@lib/redis'

/**
 * 行业板块
 */
const defaultDate = dayjs().format('YYYYMMDD')
export async function fetchIndustryBoardList(date: string = defaultDate) {
  const res = await axios.get<IndustrySector[]>('/stock_board_industry_name_em', {
    headers: {
      'cache-duration': date ? ONE_YEAR : undefined,
      'cache-key': date ? date : ''
    }
  })
  return res.data
}

/**
 * 行业板块成分股
 */
export async function fetchIndustryBoardStocks(symbol: string) {
  const res = await axios.get<IndustryStock[]>('/stock_board_industry_cons_em', {
    params: { symbol },
  })
  return res.data
}
