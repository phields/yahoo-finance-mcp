import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  getQuote,
  getHistoricalData,
  searchSymbols,
  getCompanyInfo,
  getRecommendations,
  getTrendingSymbols,
  getMarketSummary,
  getNews,
  getOptions,
  getInsights,
  getDailyGainers,
  getDailyLosers,
  getChart,
  getQuoteSummary,
} from "./tools.js";

/**
 * YahooFinanceMcp类 - 封装Yahoo Finance MCP服务器功能
 */
export class YahooFinanceMcp {
  public server: McpServer;
  private transport: StdioServerTransport | null = null;
  
  constructor() {
    // 创建MCP服务器实例
    this.server = new McpServer({
      name: "yahoo-finance-mcp",
      version: "1.4.1",
    });
    
    // 初始化工具定义
    this.setupTools();
  }
  
  /**
   * 设置工具定义
   */
  private setupTools(): void {
    // Stock quote tool
    this.server.tool(
      "get_quote",
      "Get current stock quote information",
      { symbol: z.string().describe("Stock symbol (e.g., AAPL, GOOGL)") },
      async (params) => {
        try {
          const result = await getQuote(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Historical data tool
    this.server.tool(
      "get_historical_data",
      "Get historical stock data",
      {
        symbol: z.string().describe("Stock symbol"),
        period1: z.string().default("1y").describe("Start date (YYYY-MM-DD) or period like '1mo', '1y'"),
        period2: z.string().default("now").describe("End date (YYYY-MM-DD) or 'now'"),
        interval: z.string().default("1d").describe("Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)"),
      },
      async (params) => {
        try {
          const result = await getHistoricalData(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Search symbols tool
    this.server.tool(
      "search_symbols",
      "Search for stock symbols",
      { query: z.string().describe("Search query") },
      async (params) => {
        try {
          const result = await searchSymbols(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Company info tool
    this.server.tool(
      "get_company_info",
      "Get company information and statistics",
      { symbol: z.string().describe("Stock symbol") },
      async (params) => {
        try {
          const result = await getCompanyInfo(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Recommendations tool
    this.server.tool(
      "get_recommendations",
      "Get analyst recommendations for a stock",
      { symbol: z.string().describe("Stock symbol") },
      async (params) => {
        try {
          const result = await getRecommendations(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Trending symbols tool
    this.server.tool(
      "get_trending_symbols",
      "Get trending symbols from Yahoo Finance",
      {},
      async () => {
        try {
          const result = await getTrendingSymbols({});
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Market summary tool
    this.server.tool(
      "get_market_summary",
      "Get market summary with major indices",
      {},
      async () => {
        try {
          const result = await getMarketSummary({});
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // News tool
    this.server.tool(
      "get_news",
      "Search for news articles related to a query",
      {
        query: z.string().describe("Search query for news"),
        newsCount: z.number().default(10).describe("Number of news articles to return"),
      },
      async (params) => {
        try {
          const result = await getNews(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Options tool
    this.server.tool(
      "get_options",
      "Get options data for a stock symbol",
      {
        symbol: z.string().describe("Stock symbol"),
        date: z.string().optional().describe("Expiration date for options (YYYY-MM-DD format)"),
        formatted: z.boolean().default(false).describe("Whether to format the data"),
      },
      async (params) => {
        try {
          const result = await getOptions(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Insights tool
    this.server.tool(
      "get_insights",
      "Get insights and analysis for a stock",
      {
        symbol: z.string().describe("Stock symbol"),
        reportsCount: z.number().default(5).describe("Number of reports to return"),
      },
      async (params) => {
        try {
          const result = await getInsights(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Daily gainers tool
    this.server.tool(
      "get_daily_gainers",
      "Get stocks with the highest gains for the day",
      {
        count: z.number().default(10).describe("Number of gainers to return"),
      },
      async (params) => {
        try {
          const result = await getDailyGainers(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Daily losers tool
    this.server.tool(
      "get_daily_losers",
      "Get stocks with the highest losses for the day",
      {
        count: z.number().default(10).describe("Number of losers to return"),
      },
      async (params) => {
        try {
          const result = await getDailyLosers(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Chart tool
    this.server.tool(
      "get_chart",
      "Get chart data for a stock symbol",
      {
        symbol: z.string().describe("Stock symbol"),
        period1: z.string().default("1mo").describe("Start date (YYYY-MM-DD) or period like '1mo', '1y'"),
        period2: z.string().default("now").describe("End date (YYYY-MM-DD) or 'now'"),
        interval: z.string().default("1d").describe("Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)"),
        events: z.string().default("div|split|earn").describe("Event types to return (div|split|earn)"),
      },
      async (params) => {
        try {
          const result = await getChart(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Quote summary tool
    this.server.tool(
      "get_quote_summary",
      "Get comprehensive quote summary with various modules",
      {
        symbol: z.string().describe("Stock symbol"),
        modules: z.array(z.string()).default(["summaryDetail", "financialData", "recommendationTrend", "defaultKeyStatistics"]).describe("List of modules to include (assetProfile, summaryDetail, recommendationTrend, financialData, earningsHistory, defaultKeyStatistics, calendarEvents, etc.)"),
      },
      async (params) => {
        try {
          const result = await getQuoteSummary(params);
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }
  
  /**
   * 启动MCP服务器
   * 返回一个Promise，服务器启动成功后resolve，失败则reject
   */
  public async start(): Promise<void> {
    try {
      this.transport = new StdioServerTransport();
      await this.server.connect(this.transport);
      console.error("Yahoo Finance MCP server running on stdio");
    } catch (error) {
      console.error("Failed to start MCP server:", error);
      throw error;
    }
  }
  
  /**
   * 停止MCP服务器
   * 注意：当前SDK可能没有提供disconnect方法，因此这里我们只是清理引用
   */
  public async stop(): Promise<void> {
    if (this.transport) {
      try {
        // 清理传输引用
        this.transport = null;
        console.error("Yahoo Finance MCP server stopped");
      } catch (error) {
        console.error("Failed to stop MCP server:", error);
        throw error;
      }
    }
  }
}

// 导出Agent的单例实例
export const yahooFinanceMcp = new YahooFinanceMcp();

// 如果作为直接运行的脚本，则启动服务器
if (typeof require !== 'undefined' && require.main === module) {
  yahooFinanceMcp.start().catch((error: Error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
