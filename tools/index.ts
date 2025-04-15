import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { useIndustryBoard } from './board'
import { useDashboard } from './dashboard'
import { useHKMarket } from './hk'
import { useMarket } from './market'
import { useRedis } from './redis'
import { useStock } from './stock'

export function useTools(server: McpServer) {
  useHKMarket(server)
  useMarket(server)
  useIndustryBoard(server)
  useStock(server)
  useDashboard(server)
  useRedis(server)
}
