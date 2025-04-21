import { getCachesByPrefix } from '@lib/redis'
import { callResult, stringify } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchIndustryBoardList, fetchIndustryBoardStocks } from '@services/stock/industry-board'
import { z } from 'zod'

async function getIndustryBoards(): Promise<CallToolResult> {
  try {
    const res = await fetchIndustryBoardList()
    return callResult({
      content: [
        {
          type: 'text',
          text: 'A股行业板块列表',
        },
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

async function getIndustryBoardsRotation(days: number): Promise<CallToolResult> {
  const PREFIX = 'stock_api:stock_board_industry_name_em'
  const res = await getCachesByPrefix(PREFIX, days)
  const sortedKeys = Object.keys(res).sort()
  const resultObj: Record<string, unknown[]> = {}
  sortedKeys.map(key => {
    resultObj[key] = res[key]
  })
  return {
    content: [
      {
        type: 'text',
        text: stringify(Object.values(resultObj).reverse()),
      },
    ],
  }
}

async function getIndustryBoardStocks(boardName: string): Promise<CallToolResult> {
  try {
    const res = await fetchIndustryBoardStocks(boardName)
    return {
      content: [
        {
          type: 'text',
          text: `${boardName}成分股`,
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
    'board.get_industry_rotation',
    '获取过去n天行业板块轮动',
    { days: z.number().describe('天数').max(30) },
    async ({ days }) => await getIndustryBoardsRotation(days)
  )

  server.tool(
    'board.get_industry_stocks',
    '获取行业板块成分股',
    { symbol: z.string().describe('行业板块名称') },
    async ({ symbol }) => await getIndustryBoardStocks(symbol),
  )
}
