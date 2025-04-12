import dayjs from '@lib/dayjs'
import { callResult } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchMyStocks, fetchStockPosition, updateStockBatch } from '@services/dashboard'
import { fetchStockHistory } from '@services/stock'

async function pushStockPrice(): Promise<CallToolResult> {
  try {
    const stocks = await fetchMyStocks()
    const codes = stocks.map((stock) => stock.code)
    const requests = codes.map((code: string) => {
      return fetchStockHistory({
        symbol: code,
        startDate: dayjs().format('YYYYMMDD'),
        endDate: dayjs().format('YYYYMMDD'),
      })
    })
    const results = await Promise.all(requests)
    const stockPrices = results
      .map((item) => {
        const [stock] = item
        return {
          code: stock?.股票代码 || '',
          price: Number(stock?.收盘),
        }
      })
      .filter((item) => item.code && item.price)
    await updateStockBatch(stockPrices)
    return {
      content: [
        {
          type: 'text',
          text: `${dayjs().format('YYYY-MM-DD')} 股票价格更新成功`,
        },
      ],
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `股票价格更新失败：${error}`,
        },
      ],
    }
  }
}

async function getStockPosition(): Promise<CallToolResult> {
  try {
    const response = await fetchStockPosition()

    if (!response.success) {
      return {
        isError: true,
        content: [{ type: 'text', text: `获取持仓失败：${response.data}` }],
      }
    }

    return callResult({
      content: [{ type: 'text', text: `持仓信息：${JSON.stringify(response.data)}` }],
    })
  } catch (e) {
    return callResult({
      isError: true,
      content: [{ type: 'text', text: `获取持仓失败：${e}` }],
    })
  }
}

export function useDashboard(server: McpServer) {
  server.tool('Push Stock Price', '批量推送股票价格', pushStockPrice)

  server.tool('Get Stock Position', '获取持仓信息', getStockPosition)
}
