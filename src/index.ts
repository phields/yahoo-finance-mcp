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
import yahooFinance from "yahoo-finance2";

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
          properties: {
            region: {
              type: "string",
              description: "Region (US, GB, CA, etc.)",
              default: "US",
            },
          },
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
        const { region = "US" } = args as { region?: string };
        const trending = await yahooFinance.trendingSymbols(region);
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
