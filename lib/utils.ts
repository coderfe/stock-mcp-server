import dayjs from '@lib/dayjs'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export function parseDates(days: number, isBefore = true) {
  const dates: string[] = []
  let daysCount = 0
  let index = 0

  while (daysCount < days) {
    const currentDate = isBefore ? dayjs().subtract(index, 'day') : dayjs().add(index, 'day')
    const dayOfWeek = currentDate.day()

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(currentDate.format('YYYYMMDD'))
      daysCount++
    }

    index++
  }

  return dates
}

export function isMainBoardStock(symbol: string) {
  const code = String(symbol).trim()
  if (!/^\d{6}$/.test(code)) {
    return false
  }
  const shMainBoardPrefix = ['600', '601', '603', '605']
  const szMainBoardPrefix = ['000', '001', '002']
  const sh = shMainBoardPrefix.some((prefix) => code.startsWith(prefix))
  const sz = szMainBoardPrefix.some((prefix) => code.startsWith(prefix))
  return sh || sz
}

export function isST(name: string) {
  return name.includes('ST')
}

export function isHKStock(symbol: string) {
  return /^\d{1,5}$/.test(symbol)
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
