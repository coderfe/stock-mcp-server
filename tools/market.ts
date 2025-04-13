import dayjs from '@lib/dayjs'
import { callResult, isMainBoardStock, parseDates, stringify } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchMarketWeeklyData, type MarketWeeklyParams } from '@services/stock-index'
import { fetchLimitUpPool, fetchStrongStockPool } from '@services/stock-pool'
import { z } from 'zod'

interface StockIndex {
  name: string
  symbol: string
}

const CHINA_MAIN_INDEXES: StockIndex[] = [
  { name: '沪深 300', symbol: '000300' },
  { name: '上证指数', symbol: '000001' },
  { name: '深证成指', symbol: '399001' },
  { name: '科创 50', symbol: '000688' },
]

async function getIndexWeekly(period: MarketWeeklyParams['period']): Promise<CallToolResult> {
  try {
    const startDate = dayjs().startOf('week').format('YYYYMMDD')
    const endDate = dayjs().endOf('week').format('YYYYMMDD')

    const res = await Promise.all(
      CHINA_MAIN_INDEXES.map((index) =>
        fetchMarketWeeklyData({
          symbol: index.symbol,
          period,
          startDate,
          endDate,
        }),
      ),
    )

    const data = CHINA_MAIN_INDEXES.map((index, i) => ({
      name: index.name,
      data: res[i] ?? [],
    }))

    return callResult({
      content: [{ type: 'text', text: stringify(data) }],
    })
  } catch (error) {
    console.error('获取市场周报数据失败：', error)
    return callResult({
      isError: true,
      content: [{ type: 'text', text: `获取市场周报数据失败：${error}` }],
    })
  }
}

async function analyzeStockPool(
  days: number,
  fetchFn: (date: string) => Promise<BaseStrongStock[]>,
  type: string,
): Promise<CallToolResult> {
  try {
    const dates = parseDates(days)
    const results = await Promise.all(dates.map((date) => fetchFn(date)))
    const analysisResults = dates.map((date, index) => {
      const stocks = (results[index] || []).filter((item) => isMainBoardStock(item.代码))
      return {
        date: dayjs(date).format('YYYY-MM-DD'),
        count: stocks.length,
        stocks,
      }
    })

    return callResult({
      content: [
        {
          type: 'text',
          text: `最近 ${days} 天${type}数据：${stringify(analysisResults)}`,
        },
      ],
    })
  } catch (error) {
    console.error(`获取${type}数据失败：`, error)
    return callResult({
      isError: true,
      content: [{ type: 'text', text: `获取${type}数据失败：${error}` }],
    })
  }
}

async function getLimitUpStocks(days: number): Promise<CallToolResult> {
  return analyzeStockPool(days, fetchLimitUpPool, '涨停股池')
}

async function getStrongSticks(days: number): Promise<CallToolResult> {
  return analyzeStockPool(days, fetchStrongStockPool, '强势股')
}

export function useMarket(server: McpServer) {
  server.tool(
    'market.get_weekly_data',
    '获取市场周报数据',
    { period: z.enum(['daily', 'weekly', 'monthly']) },
    async ({ period }) => await getIndexWeekly(period),
  )

  server.tool(
    'market.get_limit_up_stocks',
    '获取市场涨停股',
    { days: z.number().min(1).max(30) },
    async ({ days }) => await getLimitUpStocks(days),
  )

  server.tool(
    'market.get_strong_stocks',
    '获取市场强势股',
    { days: z.number().min(1).max(30) },
    async ({ days }) => await getStrongSticks(days),
  )
}
