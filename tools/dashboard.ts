import dayjs from 'dayjs'
import { fetchStockHistory } from '../services/aktools'
import { fetchMyStocks, fetchStockPosition, updateStockBatch } from '../services/dashboard'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export async function pushStockPrice(): Promise<CallToolResult> {
  try {
    const stocks = await fetchMyStocks()
    const codes = stocks.map((stock: any) => stock.code)
    const requests = codes.map((code: string) => {
      return fetchStockHistory({
        symbol: code,
        startDate: dayjs().format('YYYYMMDD'),
        endDate: dayjs().format('YYYYMMDD'),
      })
    })
    const results = await Promise.all(requests)
    const stockPrices = results.map((item: any) => {
      const [stock] = item
      return {
        code: stock.股票代码,
        price: Number(stock.收盘),
      }
    })
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

export async function getStockPosition(): Promise<CallToolResult> {
  try {
    const res = await fetchStockPosition()
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: `持仓信息：${JSON.stringify(res)}`,
        },
      ],
    }
  } catch (e) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `获取持仓失败：${e}`,
        },
      ],
    }
  }
}
