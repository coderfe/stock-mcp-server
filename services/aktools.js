import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

export const client = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/public',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const stockClient = setupCache(client)

export async function fetchStockIndividualInfo(symbol) {
  const res = await stockClient.get('/stock_individual_info_em', {
    params: { symbol },
  })
  return res.data
}

export async function fetchStockHistory({ symbol, startDate, endDate }) {
  const res = await stockClient.get('/stock_zh_a_hist', {
    params: { symbol, start_date: startDate, end_date: endDate },
  })
  return res.data
}

export async function fetchYearlyStockFinancialAbstract(symbol) {
  const res = await stockClient.get('/stock_financial_abstract_ths', {
    params: { symbol, indicator: '按年度' },
  })
  return res.data.slice(-3)
}

export async function fetchStockChips(symbol, days = 30) {
  const { data = [] } = await stockClient.get('/stock_cyq_em', {
    params: { symbol },
  })
  return data.slice(-days)
}

export async function fetchStockValuation(symbol) {
  const { data = [] } = await stockClient.get('/stock_value_em', {
    params: { symbol },
  })
  return data[data.length - 1]
}

export async function fetchMarketWeeklyData({
  symbol,
  period,
  startDate,
  endDate,
}) {
  const res = await stockClient.get('/index_zh_a_hist', {
    params: { symbol, period, start_date: startDate, end_date: endDate },
  })
  return res.data
}

export async function fetchStockMoneyFlow(symbol, days = 3) {
  const res = await stockClient.get('/stock_individual_fund_flow', {
    params: { stock: symbol },
  })
  return res.data.slice(-days)
}

/**
 * 获取涨停股池
 */
export async function fetchLimitUpPool(date) {
  try {
    const res = await stockClient.get('/stock_zt_pool_em', {
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
export async function fetchStrongStockPool(date) {
  try {
    const res = await stockClient.get('/stock_zt_pool_strong_em', {
      params: { date },
    })
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}
