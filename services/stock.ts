import stockClient from "../lib/stockClient"

/**
 * 个股信息查询
 */
export async function fetchStockIndividualInfo(symbol: string) {
  const res = await stockClient.get<ItemValue>('/stock_individual_info_em', {
    params: { symbol },
  })
  return res.data
}

/**
 * 个股历史行情数据
 */
export async function fetchStockHistory({ symbol, startDate, endDate }: HistoryParams) {
  const res = await stockClient.get<StockHistory[]>('/stock_zh_a_hist', {
    params: { symbol, start_date: startDate, end_date: endDate },
  })
  return res.data
}

/**
 * 个股关键指标
 */
export async function fetchYearlyStockFinancialAbstract(symbol: string) {
  const res = await stockClient.get<FinancialData[]>('/stock_financial_abstract_ths', {
    params: { symbol, indicator: '按年度' },
  })
  return res.data.slice(-3)
}

/**
 * 个股筹码分布
 */
export async function fetchStockChips(symbol: string, days = 30) {
  const { data = [] } = await stockClient.get<CostAnalysisData[]>('/stock_cyq_em', {
    params: { symbol },
  })
  return data.slice(-days)
}

/**
 * 个股估值
 */
export async function fetchStockValuation(symbol: string) {
  const { data = [] } = await stockClient.get<MarketData[]>('/stock_value_em', {
    params: { symbol },
  })
  return data[data.length - 1]
}

/**
 * 个股资金流向
 */
export async function fetchStockMoneyFlow(symbol: string, days = 3) {
  const res = await stockClient.get<CapitalFlowData[]>('/stock_individual_fund_flow', {
    params: { stock: symbol },
  })
  return res.data.slice(-days)
}
