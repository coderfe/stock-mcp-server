import axios from 'axios'
import { generateCacheKey, getCache, setCache } from '../redis'

export const instance = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/public',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

instance.interceptors.request.use(async (config) => {
  if (
    config.method?.toLowerCase() === 'get' &&
    config.headers?.['use-cache'] !== 'false'
  ) {
    const cacheKey = generateCacheKey(config)
    const cachedData = await getCache(cacheKey)
    if (cachedData) {
      const error = new Error('Cancel request due to cached data') as Error & {
        config: typeof config;
        response: {
          data: unknown;
          status: number;
          statusText: string;
        };
      }
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

instance.interceptors.response.use(
  async (response) => {
    if (
      response.config.method?.toLowerCase() === 'get' &&
      response.config.headers?.['use-cache'] !== 'false'
    ) {
      const cacheKey = generateCacheKey(response.config)
      const cacheDuration = response.config.headers?.['cache-duration'] as number | undefined
      await setCache(cacheKey, response.data, cacheDuration)
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

export default instance
