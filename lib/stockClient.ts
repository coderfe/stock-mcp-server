import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'
import { Redis } from 'ioredis'

const redis = new Redis()

export const client = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/public',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const stockClient = setupCache(client)

export default stockClient
