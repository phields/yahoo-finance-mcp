import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  ReadResourceRequest,
} from "@modelcontextprotocol/sdk/types.js";

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
 * YahooFinanceMcpAgent类 - 封装Yahoo Finance MCP服务器功能
 */
export class YahooFinanceMcpAgent {
  private server: Server;
  private transport: StdioServerTransport | null = null;
  
  constructor() {
    // 创建MCP服务器实例
    this.server = new Server({
      name: "yahoo-finance-mcp",
      version: "1.0.0",
    });
    
    // 初始化工具处理程序
    this.setupToolHandlers();
    
    // 初始化资源处理程序
    this.setupResourceHandlers();
  }
  
  /**
   * 设置工具定义和处理程序
   */
  private setupToolHandlers(): void {
    // 工具定义
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_quote",
            description: "Get current stock quote information",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol (e.g., AAPL, GOOGL)",
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "get_historical_data",
            description: "Get historical stock data",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
                period1: {
                  type: "string",
                  description: "Start date (YYYY-MM-DD) or period like '1mo', '1y'",
                  default: "1y",
                },
                period2: {
                  type: "string",
                  description: "End date (YYYY-MM-DD) or 'now'",
                  default: "now",
                },
                interval: {
                  type: "string",
                  description: "Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)",
                  default: "1d",
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "search_symbols",
            description: "Search for stock symbols",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query",
                },
              },
              required: ["query"],
            },
          },
          {
            name: "get_company_info",
            description: "Get company information and statistics",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "get_recommendations",
            description: "Get analyst recommendations for a stock",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "get_trending_symbols",
            description: "Get trending symbols from Yahoo Finance",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "get_market_summary",
            description: "Get market summary with major indices",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "get_news",
            description: "Search for news articles related to a query",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query for news",
                },
                newsCount: {
                  type: "number",
                  description: "Number of news articles to return",
                  default: 10,
                },
              },
              required: ["query"],
            },
          },
          {
            name: "get_options",
            description: "Get options data for a stock symbol",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
                date: {
                  type: "string",
                  description: "Expiration date for options (YYYY-MM-DD format)",
                },
                formatted: {
                  type: "boolean",
                  description: "Whether to format the data",
                  default: false,
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "get_insights",
            description: "Get insights and analysis for a stock",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
                reportsCount: {
                  type: "number",
                  description: "Number of reports to return",
                  default: 5,
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "get_daily_gainers",
            description: "Get stocks with the highest gains for the day",
            inputSchema: {
              type: "object",
              properties: {
                count: {
                  type: "number",
                  description: "Number of gainers to return",
                  default: 10,
                },
              },
            },
          },
          {
            name: "get_daily_losers",
            description: "Get stocks with the highest losses for the day",
            inputSchema: {
              type: "object",
              properties: {
                count: {
                  type: "number",
                  description: "Number of losers to return",
                  default: 10,
                },
              },
            },
          },
          {
            name: "get_chart",
            description: "Get chart data for a stock symbol",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
                period1: {
                  type: "string",
                  description: "Start date (YYYY-MM-DD) or period like '1mo', '1y'",
                  default: "1mo",
                },
                period2: {
                  type: "string",
                  description: "End date (YYYY-MM-DD) or 'now'",
                  default: "now",
                },
                interval: {
                  type: "string",
                  description: "Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)",
                  default: "1d",
                },
                events: {
                  type: "string",
                  description: "Event types to return (div|split|earn)",
                  default: "div|split|earn",
                },
              },
              required: ["symbol"],
            },
          },
          {
            name: "get_quote_summary",
            description: "Get comprehensive quote summary with various modules",
            inputSchema: {
              type: "object",
              properties: {
                symbol: {
                  type: "string",
                  description: "Stock symbol",
                },
                modules: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of modules to include (assetProfile, summaryDetail, recommendationTrend, financialData, earningsHistory, defaultKeyStatistics, calendarEvents, etc.)",
                  default: ["summaryDetail", "financialData", "recommendationTrend", "defaultKeyStatistics"],
                },
              },
              required: ["symbol"],
            },
          },
        ],
      };
    });

    // 工具处理程序
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No arguments provided",
            },
          ],
          isError: true,
        };
      }

      try {
        let result: any;

        switch (name) {
          case "get_quote":
            result = await getQuote(args as any);
            break;
          case "get_historical_data":
            result = await getHistoricalData(args as any);
            break;
          case "search_symbols":
            result = await searchSymbols(args as any);
            break;
          case "get_company_info":
            result = await getCompanyInfo(args as any);
            break;
          case "get_recommendations":
            result = await getRecommendations(args as any);
            break;
          case "get_trending_symbols":
            result = await getTrendingSymbols(args as any);
            break;
          case "get_market_summary":
            result = await getMarketSummary(args as any);
            break;
          case "get_news":
            result = await getNews(args as any);
            break;
          case "get_options":
            result = await getOptions(args as any);
            break;
          case "get_insights":
            result = await getInsights(args as any);
            break;
          case "get_daily_gainers":
            result = await getDailyGainers(args as any);
            break;
          case "get_daily_losers":
            result = await getDailyLosers(args as any);
            break;
          case "get_chart":
            result = await getChart(args as any);
            break;
          case "get_quote_summary":
            result = await getQuoteSummary(args as any);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
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
    });
  }
  
  /**
   * 设置资源处理程序
   */
  private setupResourceHandlers(): void {
    // 资源定义
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "yahoo-finance://market-summary",
            mimeType: "application/json",
            name: "Market Summary",
            description: "Current market summary and major indices",
          },
          {
            uri: "yahoo-finance://trending-symbols",
            mimeType: "application/json",
            name: "Trending Symbols",
            description: "Currently trending symbols",
          },
          {
            uri: "yahoo-finance://daily-gainers",
            mimeType: "application/json",
            name: "Daily Gainers",
            description: "Stocks with highest gains today",
          },
          {
            uri: "yahoo-finance://daily-losers",
            mimeType: "application/json",
            name: "Daily Losers",
            description: "Stocks with highest losses today",
          },
          {
            uri: "yahoo-finance://news/general",
            mimeType: "application/json",
            name: "General Market News",
            description: "General market news and updates",
          },
        ],
      };
    });

    // 资源读取处理程序
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
      const { uri } = request.params;

      try {
        let result: any;

        if (uri === "yahoo-finance://market-summary") {
          result = await getMarketSummary({});
        } else if (uri === "yahoo-finance://trending-symbols") {
          result = await getTrendingSymbols({});
        } else if (uri === "yahoo-finance://daily-gainers") {
          result = await getDailyGainers({ count: 10 });
        } else if (uri === "yahoo-finance://daily-losers") {
          result = await getDailyLosers({ count: 10 });
        } else if (uri === "yahoo-finance://news/general") {
          result = await getNews({ query: "market", newsCount: 10 });
        } else {
          throw new Error(`Unknown resource: ${uri}`);
        }

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(`Failed to read resource ${uri}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    });
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
export const yahooFinanceMcpAgent = new YahooFinanceMcpAgent();

// 如果作为直接运行的脚本，则启动服务器
if (typeof require !== 'undefined' && require.main === module) {
  yahooFinanceMcpAgent.start().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
