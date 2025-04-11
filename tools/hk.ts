import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fetchHKFamousStocks } from '@services/stock-hk'

export async function getHKFamousStocks(): Promise<CallToolResult> {
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
