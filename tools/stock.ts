import dayjs from '@lib/dayjs'
import { callResult, stringify } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchStockPositionBySymbol } from '@services/dashboard'
import {
  fetchStockChips,
  fetchStockHistory,
  fetchStockIndividualInfo,
  fetchStockMoneyFlow,
  fetchStockValuation,
} from '@services/stock'
import { z } from 'zod'

async function getStockAnalysis(symbol: string): Promise<CallToolResult> {
  const now = dayjs()
  const startDate = now.subtract(3, 'month').format('YYYYMMDD')
  const endDate = now.format('YYYYMMDD')

  const result: CallToolResult = {
    content: [],
  }

  const tasks = [
    { name: '信息概览', task: fetchStockIndividualInfo(symbol) },
    { name: '90 日行情数据', task: fetchStockHistory({ symbol, startDate, endDate }) },
    { name: '30 日筹码分布', task: fetchStockChips(symbol) },
    { name: '估值信息', task: fetchStockValuation(symbol) },
    { name: '3 日资金流向', task: fetchStockMoneyFlow(symbol, 3) },
    { name: '我的持仓', task: fetchStockPositionBySymbol(symbol) },
  ]

  const responses = await Promise.allSettled(tasks.map(({ task }) => task))

  responses.map((res, index) => {
    if (res.status !== 'fulfilled') return
    result.content.push({
      type: 'text',
      text: `${tasks[index]?.name}：${stringify(res.value)}`,
    })
  })

  return callResult(result)
}

export function useStock(server: McpServer) {
  const symbolSchema = z.string().regex(/^\d{6}$/, '股票代码必须是 6 位数字')

  server.tool(
    'stock.get_individual_history',
    '获取A股个股历史数据',
    {
      symbol: symbolSchema,
      startDate: z.string().regex(/^\d{8}$/, '开始日期格式错误，必须是 YYYYMMDD'),
      endDate: z.string().regex(/^\d{8}$/, '结束日期格式错误，必须是 YYYYMMDD'),
    },
    async ({ symbol, startDate, endDate }) => {
      const res = await fetchStockHistory({
        symbol: symbol,
        startDate: startDate,
        endDate: endDate,
      })
      return callResult({
        content: [
          {
            type: 'text',
            text: `个股历史数据：${stringify(res)}`,
          },
        ],
      })
    },
  )

  server.tool(
    'stock.get_individual_analysis',
    '获取A股个股分析',
    {
      symbol: symbolSchema,
    },
    async ({ symbol }) => await getStockAnalysis(symbol),
  )
}
