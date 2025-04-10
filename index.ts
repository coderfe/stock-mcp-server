import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import {
  analysisLimitUp,
  analysisStock,
  analysisStockStrength,
  getMarketWeeklyData,
  getGGTStockList,
} from './tools/aktools'
import { getStockPosition, pushStockPrice } from './tools/dashboard'
import { clearCache } from './lib/redis'

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

server.tool(
  'Get GGT Stock List',
  '港股通成分股',
  getGGTStockList,
)

server.tool('Push Stock Price', '批量推送股票价格', async () => await pushStockPrice())

server.tool('Get Stock Position', '获取持仓信息', async () => await getStockPosition())


server.tool(
  'Clear Redis Cache',
  '清除 Redis 缓存',
  async () => {
    try {
      const deletedCount = await clearCache()
      return {
        content: [
          {
            type: 'text',
            text: `成功清除缓存 ${deletedCount} 条`,
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `清除缓存失败: ${error}`,
          }
        ]
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
