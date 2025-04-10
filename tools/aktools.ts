import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import dayjs from '../lib/dayjs'
import {
  type MarketWeeklyParams,
  fetchLimitUpPool,
  fetchMarketWeeklyData,
  fetchStockChips,
  fetchStockHistory,
  fetchStockIndividualInfo,
  fetchStockMoneyFlow,
  fetchStockValuation,
  fetchStrongStockPool,
} from '../services/aktools'
import { fetchStockPositionBySymbol } from '../services/dashboard'
import { fetchGGTStockList } from '../services/ggt'

export async function analysisStock(symbol: string): Promise<CallToolResult> {
  const now = dayjs()
  const startDate = now.subtract(3, 'month').format('YYYYMMDD')
  const endDate = now.format('YYYYMMDD')
  const result = {
    content: [
      {
        type: 'text',
        text: `今日日期：${now.format('YYYY-MM-DD')}`,
      },
    ],
  }
  try {
    const info = await fetchStockIndividualInfo(symbol)
    result.content.push({
      type: 'text',
      text: `信息概览：${JSON.stringify(info)}`,
    })
  } catch (e) {
    console.log(e)
  }
  try {
    const history = await fetchStockHistory({ symbol, startDate, endDate })
    result.content.push({
      type: 'text',
      text: `90 日行情数据：${JSON.stringify(history)}`,
    })
  } catch (e) {
    console.log(e)
  }
  try {
    const chips = await fetchStockChips(symbol)
    result.content.push({
      type: 'text',
      text: `30 日筹码分布：${JSON.stringify(chips)}`,
    })
  } catch (e) {
    console.log(e)
  }
  try {
    const valuation = await fetchStockValuation(symbol)
    result.content.push({
      type: 'text',
      text: `估值信息：${JSON.stringify(valuation)}`,
    })
  } catch (e) {
    console.log(e)
  }
  try {
    const moneyFlow = await fetchStockMoneyFlow(symbol, 3)
    result.content.push({
      type: 'text',
      text: `3 日资金流向：${JSON.stringify(moneyFlow)}`,
    })
  } catch (e) {
    console.log(e)
  }
  try {
    const position = await fetchStockPositionBySymbol(symbol)
    result.content.push({
      type: 'text',
      text: `我的持仓：${JSON.stringify(position)}`,
    })
  } catch (e) {
    console.log(e)
  }
  return result as CallToolResult
}

export async function getMarketWeeklyData(
  period: MarketWeeklyParams['period'],
): Promise<CallToolResult> {
  const indexes = [
    {
      name: '沪深 300',
      symbol: '000300',
    },
    {
      name: '上证指数',
      symbol: '000001',
    },
    {
      name: '深证成指',
      symbol: '399001',
    },
    {
      name: '科创 50',
      symbol: '000688',
    },
  ]

  const startDate = dayjs().startOf('week').format('YYYYMMDD')
  const endDate = dayjs().endOf('week').format('YYYYMMDD')

  const res = await Promise.all(
    indexes.map((index) =>
      fetchMarketWeeklyData({
        symbol: index.symbol,
        period,
        startDate,
        endDate,
      }),
    ),
  )
  const data = res.map((item, index) => {
    return {
      // @ts-ignore
      name: indexes[index].name,
      data: item,
    }
  })
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data),
      },
    ],
  }
}

export async function analysisLimitUp(days: number): Promise<CallToolResult> {
  try {
    const dates = parseDates(days)
    const limitUpResults = await Promise.all(dates.map((date) => fetchLimitUpPool(date)))
    const result = dates.map((date, index) => {
      const stocks = (limitUpResults[index] || []).filter((item) => isMainBoardStock(item.代码))
      return {
        date: dayjs(date).format('YYYY-MM-DD'),
        count: stocks.length,
        stocks,
      }
    })

    return {
      content: [
        {
          type: 'text',
          text: `最近 ${days} 天涨停股池数据：${JSON.stringify(result)}`,
        },
      ],
    }
  } catch (error) {
    console.error('获取涨停股池数据失败：', error)
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `获取涨停股池数据失败：${error}`,
        },
      ],
    }
  }
}

export async function analysisStockStrength(days: number): Promise<CallToolResult> {
  try {
    const dates = parseDates(days)
    const limitUpResults = await Promise.all(dates.map((date) => fetchStrongStockPool(date)))
    const result = dates.map((date, index) => {
      const stocks = (limitUpResults[index] || []).filter((item) => isMainBoardStock(item.代码))
      return {
        date: dayjs(date).format('YYYY-MM-DD'),
        count: stocks.length,
        stocks,
      }
    })

    return {
      content: [
        {
          type: 'text',
          text: `最近 ${days} 天强势股数据：${JSON.stringify(result)}`,
        },
      ],
    }
  } catch (error) {
    console.error('获取强势股池数据失败：', error)
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `获取强势股池数据失败：${error}`,
        },
      ],
    }
  }
}

export async function getGGTStockList(): Promise<CallToolResult> {
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

function parseDates(days: number) {
  const dates = Array.from({ length: days }, (_, index) => {
    return dayjs().subtract(index, 'day').format('YYYYMMDD')
  })
  return dates
}

function isMainBoardStock(symbol: string) {
  const code = String(symbol).trim()
  if (!/^\d{6}$/.test(code)) {
    return false
  }
  const shMainBoardPrefix = ['600', '601', '603', '605']
  const szMainBoardPrefix = ['000', '001', '002']
  return (
    shMainBoardPrefix.some((prefix) => code.startsWith(prefix)) ||
    szMainBoardPrefix.some((prefix) => code.startsWith(prefix))
  )
}
