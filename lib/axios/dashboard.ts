import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.coderfee.com',
  headers: {
    Authorization: `Bearer ${process.env.DASHBOARD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})
