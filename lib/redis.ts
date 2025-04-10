import type { InternalAxiosRequestConfig } from 'axios'
import { Redis } from 'ioredis'

export const CACHE_DURATION = 24 * 60 * 60
export const CACHE_PREFIX = 'stock_api:'

export const isEmptyData = (data: unknown | null | undefined | Array<unknown> | Record<string, unknown>): boolean => {
  if (data === null || data === undefined) return true
  if (Array.isArray(data) && data.length === 0) return true
  if (typeof data === 'object' && Object.keys(data).length === 0) return true
  return false
}

export const generateCacheKey = (config: InternalAxiosRequestConfig): string => {
  const { baseURL, url, params } = config
  const queryString = new URLSearchParams(params).toString()
  const key = `${baseURL}${url}?${queryString}`
  return `${CACHE_PREFIX}${Buffer.from(key).toString('base64')}`
}

export const redis = new Redis()

export const getCache = async (key: string) => {
  try {
    const cached = await redis.get(key)
    if (cached) {
      const parsedData = JSON.parse(cached)
      return isEmptyData(parsedData) ? null : parsedData
    }
  } catch (error) {
    console.error('Redis get error:', error)
  }
  return null
}

export const setCache = async <T = unknown>(key: string, value: T, duration: number = CACHE_DURATION) => {
  try {
    if (!isEmptyData(value)) {
      await redis.setex(key, duration, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export const clearCache = async (): Promise<number> => {
  let cursor = '0'
  let totalDeleted = 0

  try {
    do {
      const [newCursor, keys] = await redis.scan(cursor, 'MATCH', `${CACHE_PREFIX}*`, 'COUNT', '100')
      cursor = newCursor

      if (keys.length > 0) {
        await redis.del(...keys)
        totalDeleted += keys.length
      }
    } while (cursor !== '0')

    return totalDeleted
  } catch (error) {
    console.error('Redis clear cache error:', error)
    throw error
  }
}
