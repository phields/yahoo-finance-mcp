#!/usr/bin/env node
/**
 * Yahoo Finance MCP Server - 入口文件
 * 使用新的McpAgent类启动MCP服务器
 */
import { yahooFinanceMcpAgent } from './mcp-agent.js';

// 启动MCP服务器
async function main() {
  try {
    await yahooFinanceMcpAgent.start();
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// 启动服务
main().catch((error) => {
  console.error("Uncaught error:", error);
  process.exit(1);
});
