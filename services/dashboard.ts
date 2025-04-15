import axios from '@lib/axios/dashboard'

export async function fetchStockPosition() {
  const res = await axios.get<StockPositionsResponse>('/trade/positions')
  return res.data
}

export async function fetchStockPositionBySymbol(symbol: string) {
  const res = await axios.get(`/trade/positions/${symbol}`)
  return res.data
}

export async function fetchMyStocks() {
  const res = await axios.get<StockInfoResponse>('/trade/stocks')
  return res.data.data
}

export async function updateStockBatch(data: UpdateStockPriceFormData[]) {
  const res = await axios.post('/trade/positions/batch', data)
  return res.data
}
