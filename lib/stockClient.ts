import axios from 'axios'
import { Redis } from 'ioredis'

const redis = new Redis()

export const stockClient = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/public',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export default stockClient
