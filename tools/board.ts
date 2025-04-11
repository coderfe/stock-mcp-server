import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchIndustryBoardList, fetchIndustryBoardStocks } from '@services/stock-board'

export async function getIndustryBoardList(): Promise<CallToolResult> {
  try {
    const res = await fetchIndustryBoardList()
    return {
      content: [
        {
          type: 'text',
          text: '获取行业板块列表成功',
        },
        {
          type: 'text',
          text: JSON.stringify(res),
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

/**
 * 板块成分股
 */
export async function getIndustryBoardStocks(boardName: string): Promise<CallToolResult> {
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
          text: JSON.stringify(res),
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
