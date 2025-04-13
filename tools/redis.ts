import { clearCache } from '@lib/redis'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export function useRedis(server: McpServer) {
  server.tool('redis.clear_cache', '清除 Redis 缓存', async () => {
    try {
      const deletedCount = await clearCache()
      return {
        content: [
          {
            type: 'text',
            text: `成功清除缓存 ${deletedCount} 条`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `清除缓存失败: ${error}`,
          },
        ],
      }
    }
  })
}
