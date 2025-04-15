import { callResult, stringify } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchGGTStockList, fetchHKFamousStocks, fetchHKStockHistory } from '@services/stock/hk'
import { z } from 'zod'

async function getHKFamousStocks(): Promise<CallToolResult> {
  try {
    const res = await fetchHKFamousStocks()
    return {
      content: [
        {
          type: 'text',
          text: stringify(res),
        },
      ],
    }
  } catch (e) {
    return {
      content: [
        {
          type: 'text',
          text: `获取优质港股失败：${e}`,
        },
      ],
    }
  }
}

async function getHKStockList(): Promise<CallToolResult> {
  try {
    const result = await fetchGGTStockList()
    return callResult({
      content: [
        {
          type: 'text',
          text: `港股通成分股：${stringify(result)}`,
        },
      ],
    })
  } catch (error) {
    console.error('获取港股通成分股数据失败：', error)
    return callResult({
      isError: true,
      content: [
        {
          type: 'text',
          text: `获取港股通成分股数据失败：${error}`,
        },
      ],
    })
  }
}

export function useHKMarket(server: McpServer) {
  server.tool('hk.get_stocks', '获取港股通成分股', getHKStockList)

  server.tool('hk.get_famous_stocks', '获取优质港股', getHKFamousStocks)

  server.tool(
    'hk.get_stock_history',
    '获取港股个股历史数据',
    {
      symbol: z.string().describe('港股 5 位数字股票代码'),
      startDate: z.string().regex(/^\d{8}$/, '开始日期格式错误，必须是 YYYYMMDD'),
      endDate: z.string().regex(/^\d{8}$/, '结束日期格式错误，必须是 YYYYMMDD'),
    },
    async ({ symbol, startDate, endDate }) => {
      const res = await fetchHKStockHistory({
        symbol: symbol,
        startDate: startDate,
        endDate: endDate,
      })
      return callResult({
        content: [
          {
            type: 'text',
            text: `${symbol} 历史数据：${stringify(res)}`,
          },
        ],
      })
    },
  )
}
