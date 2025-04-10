import axios from 'axios'
import { generateCacheKey, getCache, setCache } from './redis'

export const stockClient = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/public',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

stockClient.interceptors.request.use(async (config) => {
  if (config.method?.toLowerCase() === 'get') {
    const cacheKey = generateCacheKey(config)
    const cachedData = await getCache(cacheKey)
    if (cachedData) {
      const error: any = new Error('Cancel request due to cached data')
      error.config = config
      error.response = {
        data: cachedData,
        status: 200,
        statusText: 'OK (cached)',
      }
      throw error
    }
  }
  return config
})

stockClient.interceptors.response.use(
  async (response) => {
    if (response.config.method?.toLowerCase() === 'get') {
      const cacheKey = generateCacheKey(response.config)
      await setCache(cacheKey, response.data)
    }
    return response
  },
  (error) => {
    if (error.response?.statusText === 'OK (cached)') {
      return Promise.resolve(error.response)
    }
    return Promise.reject(error)
  },
)

export default stockClient
