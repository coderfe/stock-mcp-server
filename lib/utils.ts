import dayjs from '@lib/dayjs'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export function parseDates(days: number) {
  const dates = Array.from({ length: days }, (_, index) => {
    return dayjs().subtract(index, 'day').format('YYYYMMDD')
  })
  return dates
}

export function isMainBoardStock(symbol: string) {
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

export function callResult(result: CallToolResult) {
  result.content.unshift({
    type: 'text',
    text: `当前系统时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
  })
  return result
}

export function stringify(obj: unknown): string {
  return JSON.stringify(obj)
}
