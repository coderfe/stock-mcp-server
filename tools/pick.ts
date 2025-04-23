import { stringify } from '@lib/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  fetchContinuousRiseStocks,
  fetchContinuousVolumeStocks,
  fetchVolumePriceStocks,
} from '@services/stock/pick'
import { intersectionBy } from 'es-toolkit'

async function pickStock() {
  const continuousRiseStocks = await fetchContinuousRiseStocks()
  const volumePriceStocks = await fetchVolumePriceStocks()
  const continuousVolumeStocks = await fetchContinuousVolumeStocks()
  const b = intersectionBy(volumePriceStocks, continuousVolumeStocks, (i) => i.股票代码)
  const res = intersectionBy(b, continuousRiseStocks, (i) => i.股票代码)

  return {
    content: res,
  }
}

export function usePickStock(server: McpServer) {
  server.tool('pick.stock', '技术指标选股', async () => {
    const res = await pickStock()
    return {
      content: [
        {
          type: 'text',
          text: `${stringify(res)}`,
        },
      ],
    }
  })
}
