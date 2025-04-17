import type { InternalAxiosRequestConfig } from 'axios'
import { Redis } from 'ioredis'
import { stringify } from './utils'

export const CACHE_DURATION = 8 * 60 * 60
export const CACHE_PREFIX = 'stock_api:'

export const isEmptyData = (data: unknown | null | undefined | Array<unknown> | Record<string, unknown>): boolean => {
  if (data === null || data === undefined) return true
  if (Array.isArray(data) && data.length === 0) return true
  if (typeof data === 'object' && Object.keys(data).length === 0) return true
  return false
}

export const generateCacheKey = (config: InternalAxiosRequestConfig): string => {
  const { url = '', params } = config
  const customCacheKey = config.headers?.['cache-key'] as string | undefined
  const queryString = new URLSearchParams(params).toString()

  let key = url.replace('/', '').replaceAll('/', '_')
  if (queryString) {
    key += `:${queryString}`
  }

  if (customCacheKey) {
    key += `:${customCacheKey}`
  }

  return `${CACHE_PREFIX}${key}`
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
      await redis.setex(key, duration, stringify(value))
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
