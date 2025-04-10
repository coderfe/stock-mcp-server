import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { clearCache } from './lib/redis'
import {
  analysisStock,
  analysisLimitUp,
  analysisStockStrength,
  getHKStockList,
  getMarketWeeklyData,
} from './tools/aktools'
import { getStockPosition, pushStockPrice } from './tools/dashboard'
import { fetchStockHistory } from './services/stock'
import { fetchHKStockHistory } from './services/stock-hk'
import { getHKFamousStocks } from './tools/hk'

const server = new McpServer(
  {
    name: 'stock-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      logging: {},
      tools: {
        listChanged: true,
      },
    },
  },
)

server.tool(
  'Individual Stock History',
  '个股历史行情数据-A股',
  {
    symbol: z.string().regex(/^\d{6}$/, '股票代码必须是 6 位数字'),
    startDate: z.string().regex(/^\d{8}$/, '开始日期格式错误，必须是 YYYYMMDD'),
    endDate: z.string().regex(/^\d{8}$/, '结束日期格式错误，必须是 YYYYMMDD'),
  },
  async ({ symbol, startDate, endDate }) => {
    const res = await fetchStockHistory({
      symbol: symbol,
      startDate: startDate,
      endDate: endDate,
    })
    return {
      content: [{
        type: 'text',
        text: `个股历史数据：${JSON.stringify(res)}`,
      }]
    }
  }
)

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
      content: [{
        type: 'text',
        text: `${symbol} 历史数据：${JSON.stringify(res)}`,
      }]
    }
  }
)

server.tool(
  'Famous HK Stocks',
  '优质港股',
  getHKFamousStocks
)

server.tool(
  'Analysis Stock',
  '个股分析',
  { symbol: z.string().regex(/^\d{6}$/, '股票代码必须是 6 位数字') },
  async ({ symbol }) => await analysisStock(symbol),
)

server.tool(
  'Analysis Limit Up',
  '涨停股分析',
  { days: z.number().min(1).max(30) },
  async ({ days }) => await analysisLimitUp(days),
)

server.tool(
  'Analysis Strong Stock',
  '强势股分析',
  { days: z.number().min(1).max(30) },
  async ({ days }) => await analysisStockStrength(days),
)

server.tool(
  'Market Weekly Data',
  '大盘周报',
  { period: z.enum(['daily', 'weekly', 'monthly']) },
  async ({ period }) => await getMarketWeeklyData(period),
)

server.tool('Get GGT Stock List', '港股通成分股', getHKStockList)

server.tool('Push Stock Price', '批量推送股票价格', pushStockPrice)

server.tool('Get Stock Position', '获取持仓信息', getStockPosition)

server.tool('Clear Redis Cache', '清除 Redis 缓存', async () => {
  try {
    const deletedCount = await clearCache()
    return {
      content: [
        {
          type: 'text',
          text: `成功清除缓存 ${deletedCount} 条`,
        },
      ],
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `清除缓存失败: ${error}`,
        },
      ],
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
