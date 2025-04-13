import axios from 'axios'

export const myClient = axios.create({
  baseURL: 'https://api.coderfee.com',
  headers: {
    Authorization: `Bearer ${process.env.DASHBOARD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export async function fetchStockPosition() {
  const res = await myClient.get<StockPositionsResponse>('/trade/positions')
  return res.data
}

export async function fetchStockPositionBySymbol(symbol: string) {
  const res = await myClient.get(`/trade/positions/${symbol}`)
  return res.data
}

export async function fetchMyStocks() {
  const res = await myClient.get<StockInfoResponse>('/trade/stocks')
  return res.data.data
}

export async function updateStockBatch(data: UpdateStockPriceFormData[]) {
  const res = await myClient.post('/trade/positions/batch', data)
  return res.data
}
