import axios from '@lib/axios/stock'

/**
 * 行业板块
 */
export async function fetchIndustryBoardList() {
  const res = await axios.get<IndustrySector[]>('/stock_board_industry_name_em')
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
