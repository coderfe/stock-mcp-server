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
  const res = await myClient.get('/trade/positions')
  return res.data
}

export async function fetchStockPositionBySymbol(symbol) {
  const res = await myClient.get(`/trade/positions/${symbol}`)
  return JSON.stringify(res.data)
}

export async function fetchMyStocks() {
  const res = await myClient.get('/trade/stocks')
  return res.data.data
}

export async function updateStockBatch(data) {
  const res = await myClient.post('/trade/positions/batch', data)
  return JSON.stringify(res.data)
}
