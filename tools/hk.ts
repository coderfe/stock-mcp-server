import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchGGTStockList, fetchHKFamousStocks, fetchHKStockHistory } from '@services/stock-hk'
import { z } from 'zod'

async function getHKFamousStocks(): Promise<CallToolResult> {
  try {
    const res = await fetchHKFamousStocks()
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(res),
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
    const limitedResult = result.slice(0, 30)
    return {
      content: [
        {
          type: 'text',
          text: `港股通成分股：${JSON.stringify(limitedResult)}`,
        },
      ],
    }
  } catch (error) {
    console.error('获取港股通成分股数据失败：', error)
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `获取港股通成分股数据失败：${error}`,
        },
      ],
    }
  }
}

export function useHKMarket(server: McpServer) {
  server.tool('Get HK Stocks', '港股通成分股', getHKStockList)

  server.tool('Get Famous HK Stocks', '优质港股', getHKFamousStocks)

  server.tool(
    'Individual Stock History — HK',
    '个股历史行情数据-港股',
    {
      symbol: z.string().regex(/^\d{5}$/, '股票代码必须是 5 位数字'),
      startDate: z.string().regex(/^\d{8}$/, '开始日期格式错误，必须是 YYYYMMDD'),
      endDate: z.string().regex(/^\d{8}$/, '结束日期格式错误，必须是 YYYYMMDD'),
    },
    async ({ symbol, startDate, endDate }) => {
      const res = await fetchHKStockHistory({
        symbol: symbol,
        startDate: startDate,
        endDate: endDate,
      })
      return {
        content: [
          {
            type: 'text',
            text: `${symbol} 历史数据：${JSON.stringify(res)}`,
          },
        ],
      }
    },
  )
}
