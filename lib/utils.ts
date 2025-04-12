import dayjs from '@lib/dayjs'

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
