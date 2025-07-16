#!/usr/bin/env node
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
import YahooFinance from "yahoo-finance2";

// Initialize the Yahoo Finance client
const yahooFinance = new YahooFinance();

const server = new Server(
  {
    name: "yahoo-finance-mcp",
    version: "1.0.0",
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
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

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
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
    switch (name) {
      case "get_quote": {
        const symbol = (args as { symbol: string }).symbol;
        const quote = await yahooFinance.quote(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(quote, null, 2),
            },
          ],
        };
      }

      case "get_historical_data": {
        const { symbol, period1 = "1y", period2 = "now", interval = "1d" } = args as {
          symbol: string;
          period1?: string;
          period2?: string;
          interval?: string;
        };
        
        // Parse period strings
        const parsePeriod = (period: string) => {
          if (period === "now") return new Date();
          if (period.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(period);
          return period;
        };
        
        const data = await yahooFinance.historical(symbol, {
          period1: parsePeriod(period1),
          period2: parsePeriod(period2),
          interval: interval as any,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "search_symbols": {
        const { query } = args as { query: string };
        const results = await yahooFinance.search(query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case "get_company_info": {
        const { symbol } = args as { symbol: string };
        const [quoteSummary, assetProfile] = await Promise.all([
          yahooFinance.quoteSummary(symbol, {
            modules: ["summaryDetail", "financialData", "defaultKeyStatistics"]
          }),
          yahooFinance.quoteSummary(symbol, {
            modules: ["assetProfile"]
          }).catch(() => null), // Some symbols might not have asset profile
        ]);
        
        const companyInfo = {
          quote: quoteSummary,
          profile: assetProfile,
        };
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(companyInfo, null, 2),
            },
          ],
        };
      }

      case "get_recommendations": {
        const { symbol } = args as { symbol: string };
        const recommendations = await yahooFinance.recommendationsBySymbol(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(recommendations, null, 2),
            },
          ],
        };
      }

      case "get_trending_symbols": {
        const trending = await yahooFinance.trendingSymbols("US");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(trending, null, 2),
            },
          ],
        };
      }

      case "get_market_summary": {
        // Get major indices
        const indices = ["^GSPC", "^DJI", "^IXIC", "^RUT", "^VIX"];
        const quotes = await Promise.all(
          indices.map(symbol => yahooFinance.quote(symbol))
        );
        
        const marketSummary = {
          indices: quotes.map(quote => ({
            symbol: quote.symbol,
            shortName: quote.shortName,
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChange: quote.regularMarketChange,
            regularMarketChangePercent: quote.regularMarketChangePercent,
            regularMarketTime: quote.regularMarketTime,
          })),
          timestamp: new Date().toISOString(),
        };
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(marketSummary, null, 2),
            },
          ],
        };
      }

      case "get_news": {
        const { query, newsCount = 10 } = args as {
          query: string;
          newsCount?: number;
        };
        
        const searchResults = await yahooFinance.search(query, {
          newsCount,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(searchResults.news, null, 2),
            },
          ],
        };
      }

      case "get_options": {
        const { symbol, date, formatted = false } = args as {
          symbol: string;
          date?: string;
          formatted?: boolean;
        };
        
        const queryOptions: any = { formatted };
        if (date) {
          queryOptions.date = new Date(date);
        }
        
        const options = await yahooFinance.options(symbol, queryOptions);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(options, null, 2),
            },
          ],
        };
      }

      case "get_insights": {
        const { symbol, reportsCount = 5 } = args as {
          symbol: string;
          reportsCount?: number;
        };
        
        const insights = await yahooFinance.insights(symbol, {
          reportsCount,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(insights, null, 2),
            },
          ],
        };
      }

      case "get_daily_gainers": {
        const { count = 10 } = args as {
          count?: number;
        };
        
        try {
          // 设置查询选项，支持语言和区域设置
          const queryOptions = { 
            count, 
            lang: "en-US", 
            region: "US" 
          };
          
          // 使用更加健壮的方式处理数据请求
          const gainersResult = await yahooFinance.dailyGainers(queryOptions).catch(async (yahooError) => {
            // 记录原始错误，但继续尝试备用方法
            console.error("Yahoo Finance dailyGainers API call failed:", yahooError);
            
            // 备用方式：直接使用 Yahoo Finance API
            const url = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=false&lang=en-US&region=US&scrIds=day_gainers&count=${count}`;
            
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Yahoo Finance API returned status ${response.status}`);
            }
            
            const data = await response.json();
            return data?.finance?.result?.[0] || { count: 0, quotes: [] };
          });
          
          if (!gainersResult) {
            throw new Error("无法获取每日涨幅股票数据");
          }
          
          // 处理和清理数据
          const safeGainers = {
            count: gainersResult.count || 0,
            quotes: (gainersResult.quotes || []).map((item: any) => ({
              symbol: item.symbol || '',
              shortName: item.shortName || item.symbol || '',
              regularMarketPrice: item.regularMarketPrice || null,
              regularMarketChange: item.regularMarketChange || null,
              regularMarketChangePercent: item.regularMarketChangePercent || null,
              regularMarketVolume: item.regularMarketVolume || null,
              marketCap: item.marketCap || null,
              exchange: item.exchange || null,
              fullExchangeName: item.fullExchangeName || null
            })),
            start: gainersResult.start,
            timestamp: new Date().toISOString()
          };
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(safeGainers, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get_daily_gainers:", error);
          return {
            content: [
              {
                type: "text",
                text: `获取每日涨幅股票数据时发生错误: ${error instanceof Error ? error.message : "未知错误"}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "get_daily_losers": {
        const { count = 10 } = args as {
          count?: number;
        };
        
        try {
          // 设置查询选项，支持语言和区域设置
          const queryOptions = { 
            count, 
            lang: "en-US", 
            region: "US" 
          };
          
          // 使用更加健壮的方式处理数据请求
          const losersResult = await yahooFinance.dailyLosers(queryOptions).catch(async (yahooError) => {
            // 记录原始错误，但继续尝试备用方法
            console.error("Yahoo Finance dailyLosers API call failed:", yahooError);
            
            // 备用方式：直接使用 Yahoo Finance API
            const url = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=false&lang=en-US&region=US&scrIds=day_losers&count=${count}`;
            
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Yahoo Finance API returned status ${response.status}`);
            }
            
            const data = await response.json();
            return data?.finance?.result?.[0] || { count: 0, quotes: [] };
          });
          
          if (!losersResult) {
            throw new Error("无法获取每日跌幅股票数据");
          }
          
          // 处理和清理数据
          const safeLosers = {
            count: losersResult.count || 0,
            quotes: (losersResult.quotes || []).map((item: any) => ({
              symbol: item.symbol || '',
              shortName: item.shortName || item.symbol || '',
              regularMarketPrice: item.regularMarketPrice || null,
              regularMarketChange: item.regularMarketChange || null,
              regularMarketChangePercent: item.regularMarketChangePercent || null,
              regularMarketVolume: item.regularMarketVolume || null,
              marketCap: item.marketCap || null,
              exchange: item.exchange || null,
              fullExchangeName: item.fullExchangeName || null
            })),
            start: losersResult.start,
            timestamp: new Date().toISOString()
          };
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(safeLosers, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get_daily_losers:", error);
          return {
            content: [
              {
                type: "text",
                text: `获取每日跌幅股票数据时发生错误: ${error instanceof Error ? error.message : "未知错误"}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "get_chart": {
        const { symbol, period1 = "1mo", period2 = "now", interval = "1d", events = "div|split|earn" } = args as {
          symbol: string;
          period1?: string;
          period2?: string;
          interval?: string;
          events?: string;
        };
        
        try {
          // Parse period strings
          const parsePeriod = (period: string) => {
            if (period === "now") return new Date();
            if (period.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(period);
            return period;
          };
          
          const chart = await yahooFinance.chart(symbol, {
            period1: parsePeriod(period1),
            period2: parsePeriod(period2),
            interval: interval as any,
            events,
          });
          
          // 安全处理 chart 数据，确保可以序列化为 JSON
          const safeChart = JSON.parse(JSON.stringify(chart, (key, value) => {
            // 处理无法序列化的特殊对象，如日期等
            if (value instanceof Date) return value.toISOString();
            return value;
          }));
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(safeChart, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get_chart:", error);
          return {
            content: [
              {
                type: "text",
                text: `获取图表数据时发生错误: ${error instanceof Error ? error.message : "未知错误"}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "get_quote_summary": {
        const { symbol, modules = ["summaryDetail", "financialData", "recommendationTrend", "defaultKeyStatistics"] } = args as {
          symbol: string;
          modules?: string[];
        };
        
        try {
          const quoteSummary = await yahooFinance.quoteSummary(symbol, {
            modules: modules as any,
          });
          
          // 安全处理 quoteSummary 数据，确保可以序列化为 JSON
          const safeQuoteSummary = JSON.parse(JSON.stringify(quoteSummary, (key, value) => {
            // 处理无法序列化的特殊对象，如日期等
            if (value instanceof Date) return value.toISOString();
            return value;
          }));
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(safeQuoteSummary, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get_quote_summary:", error);
          return {
            content: [
              {
                type: "text",
                text: `获取股票摘要数据时发生错误: ${error instanceof Error ? error.message : "未知错误"}`,
              },
            ],
            isError: true,
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
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

// Resource definitions
server.setRequestHandler(ListResourcesRequestSchema, async () => {
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

server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const { uri } = request.params;

  try {
    if (uri === "yahoo-finance://market-summary") {
      const indices = ["^GSPC", "^DJI", "^IXIC", "^RUT", "^VIX"];
      const quotes = await Promise.all(
        indices.map(symbol => yahooFinance.quote(symbol))
      );
      
      const marketSummary = {
        indices: quotes.map(quote => ({
          symbol: quote.symbol,
          shortName: quote.shortName,
          regularMarketPrice: quote.regularMarketPrice,
          regularMarketChange: quote.regularMarketChange,
          regularMarketChangePercent: quote.regularMarketChangePercent,
          regularMarketTime: quote.regularMarketTime,
        })),
        timestamp: new Date().toISOString(),
      };
      
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(marketSummary, null, 2),
          },
        ],
      };
    }

    if (uri === "yahoo-finance://trending-symbols") {
      const trending = await yahooFinance.trendingSymbols("US");
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(trending, null, 2),
          },
        ],
      };
    }

    if (uri === "yahoo-finance://daily-gainers") {
      try {
        // 设置查询选项
        const queryOptions = { 
          count: 10, 
          lang: "en-US", 
          region: "US" 
        };
        
        // 使用更加健壮的方式处理数据请求
        const gainersResult = await yahooFinance.dailyGainers(queryOptions).catch(async (yahooError) => {
          // 记录原始错误，但继续尝试备用方法
          console.error("Yahoo Finance dailyGainers API call failed:", yahooError);
          
          // 备用方式：直接使用 Yahoo Finance API
          const url = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=false&lang=en-US&region=US&scrIds=day_gainers&count=10`;
          
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Yahoo Finance API returned status ${response.status}`);
          }
          
          const data = await response.json();
          return data?.finance?.result?.[0] || { count: 0, quotes: [] };
        });
        
        if (!gainersResult) {
          throw new Error("无法获取每日涨幅股票数据");
        }
        
        // 处理和清理数据
        const safeGainers = {
          count: gainersResult.count || 0,
          quotes: (gainersResult.quotes || []).map((item: any) => ({
            symbol: item.symbol || '',
            shortName: item.shortName || item.symbol || '',
            regularMarketPrice: item.regularMarketPrice || null,
            regularMarketChange: item.regularMarketChange || null,
            regularMarketChangePercent: item.regularMarketChangePercent || null,
            regularMarketVolume: item.regularMarketVolume || null,
            marketCap: item.marketCap || null,
            exchange: item.exchange || null,
            fullExchangeName: item.fullExchangeName || null
          })),
          start: gainersResult.start,
          timestamp: new Date().toISOString()
        };
        
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(safeGainers, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error in daily-gainers resource:", error);
        throw new Error(`获取每日涨幅股票数据失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }

    if (uri === "yahoo-finance://daily-losers") {
      try {
        // 设置查询选项
        const queryOptions = { 
          count: 10, 
          lang: "en-US", 
          region: "US" 
        };
        
        // 使用更加健壮的方式处理数据请求
        const losersResult = await yahooFinance.dailyLosers(queryOptions).catch(async (yahooError) => {
          // 记录原始错误，但继续尝试备用方法
          console.error("Yahoo Finance dailyLosers API call failed:", yahooError);
          
          // 备用方式：直接使用 Yahoo Finance API
          const url = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=false&lang=en-US&region=US&scrIds=day_losers&count=10`;
          
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Yahoo Finance API returned status ${response.status}`);
          }
          
          const data = await response.json();
          return data?.finance?.result?.[0] || { count: 0, quotes: [] };
        });
        
        if (!losersResult) {
          throw new Error("无法获取每日跌幅股票数据");
        }
        
        // 处理和清理数据
        const safeLosers = {
          count: losersResult.count || 0,
          quotes: (losersResult.quotes || []).map((item: any) => ({
            symbol: item.symbol || '',
            shortName: item.shortName || item.symbol || '',
            regularMarketPrice: item.regularMarketPrice || null,
            regularMarketChange: item.regularMarketChange || null,
            regularMarketChangePercent: item.regularMarketChangePercent || null,
            regularMarketVolume: item.regularMarketVolume || null,
            marketCap: item.marketCap || null,
            exchange: item.exchange || null,
            fullExchangeName: item.fullExchangeName || null
          })),
          start: losersResult.start,
          timestamp: new Date().toISOString()
        };
        
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(safeLosers, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error in daily-losers resource:", error);
        throw new Error(`获取每日跌幅股票数据失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }

    if (uri === "yahoo-finance://news/general") {
      const searchResults = await yahooFinance.search("market", {
        newsCount: 10,
        region: "US",
        lang: "en-US",
      });
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(searchResults.news, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  } catch (error) {
    throw new Error(`Failed to read resource ${uri}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Yahoo Finance MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
