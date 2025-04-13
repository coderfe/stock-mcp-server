import { callResult, stringify } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchIndustryBoardList, fetchIndustryBoardStocks } from '@services/stock-board'
import { z } from 'zod'

async function getIndustryBoards(): Promise<CallToolResult> {
  try {
    const res = await fetchIndustryBoardList()
    return callResult({
      content: [
        {
          type: 'text',
          text: stringify(res),
        },
      ],
    })
  } catch (error) {
    return callResult({
      isError: true,
      content: [
        {
          type: 'text',
          text: `${error}`,
        },
      ],
    })
  }
}

async function getIndustryBoardStocks(boardName: string): Promise<CallToolResult> {
  try {
    const res = await fetchIndustryBoardStocks(boardName)
    return {
      content: [
        {
          type: 'text',
          text: '获取行业板块成分股列表成功',
        },
        {
          type: 'text',
          text: stringify(res),
        },
      ],
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `${error}`,
        },
      ],
    }
  }
}

export function useIndustryBoard(server: McpServer) {
  server.tool('board.get_industry_list', '获取行业板块列表', getIndustryBoards)

  server.tool(
    'board.get_industry_stocks',
    '获取行业板块成分股',
    { symbol: z.string().describe('行业板块名称') },
    async ({ symbol }) => await getIndustryBoardStocks(symbol),
  )
}
