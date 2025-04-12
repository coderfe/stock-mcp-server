import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import packageJson from './package.json' with { type: 'json' }
import { useDashboard, useHKMarket, useIndustryBoard, useMarket, useRedis, useStock } from './tools'

const server = new McpServer(
  {
    name: 'stock-mcp-server',
    version: packageJson.version,
  },
  {
    capabilities: {
      logging: {},
      tools: {
        listChanged: true,
      },
    },
  },
)

useHKMarket(server)
useMarket(server)
useIndustryBoard(server)
useStock(server)
useDashboard(server)
useRedis(server)

const transport = new StdioServerTransport()
await server.connect(transport)
