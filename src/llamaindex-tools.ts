import { tool } from "@llamaindex/core/tools";
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
  getQuoteSchema,
  getHistoricalDataSchema,
  searchSymbolsSchema,
  getCompanyInfoSchema,
  getRecommendationsSchema,
  getTrendingSymbolsSchema,
  getMarketSummarySchema,
  getNewsSchema,
  getOptionsSchema,
  getInsightsSchema,
  getDailyGainersSchema,
  getDailyLosersSchema,
  getChartSchema,
  getQuoteSummarySchema,
} from "./tools.js";

// Helper function to safely serialize data to JSON
function toJSON(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  }));
}

// Wrapper functions that ensure JSONValue compatibility
async function getQuoteWrapper(params: any) {
  const result = await getQuote(params);
  return toJSON(result);
}

async function getHistoricalDataWrapper(params: any) {
  const result = await getHistoricalData(params);
  return toJSON(result);
}

async function searchSymbolsWrapper(params: any) {
  const result = await searchSymbols(params);
  return toJSON(result);
}

async function getCompanyInfoWrapper(params: any) {
  const result = await getCompanyInfo(params);
  return toJSON(result);
}

async function getRecommendationsWrapper(params: any) {
  const result = await getRecommendations(params);
  return toJSON(result);
}

async function getTrendingSymbolsWrapper(params: any) {
  const result = await getTrendingSymbols(params);
  return toJSON(result);
}

async function getMarketSummaryWrapper(params: any) {
  const result = await getMarketSummary(params);
  return toJSON(result);
}

async function getNewsWrapper(params: any) {
  const result = await getNews(params);
  return toJSON(result);
}

async function getOptionsWrapper(params: any) {
  const result = await getOptions(params);
  return toJSON(result);
}

async function getInsightsWrapper(params: any) {
  const result = await getInsights(params);
  return toJSON(result);
}

async function getDailyGainersWrapper(params: any) {
  const result = await getDailyGainers(params);
  return toJSON(result);
}

async function getDailyLosersWrapper(params: any) {
  const result = await getDailyLosers(params);
  return toJSON(result);
}

async function getChartWrapper(params: any) {
  const result = await getChart(params);
  return toJSON(result);
}

async function getQuoteSummaryWrapper(params: any) {
  const result = await getQuoteSummary(params);
  return toJSON(result);
}

// LlamaIndex tool definitions
export const getQuoteTool = () => {
  return tool(getQuoteWrapper, {
    name: "get_quote",
    description: "Get current stock quote information",
    parameters: getQuoteSchema,
  });
};

export const getHistoricalDataTool = () => {
  return tool(getHistoricalDataWrapper, {
    name: "get_historical_data",
    description: "Get historical stock data",
    parameters: getHistoricalDataSchema,
  });
};

export const searchSymbolsTool = () => {
  return tool(searchSymbolsWrapper, {
    name: "search_symbols",
    description: "Search for stock symbols",
    parameters: searchSymbolsSchema,
  });
};

export const getCompanyInfoTool = () => {
  return tool(getCompanyInfoWrapper, {
    name: "get_company_info",
    description: "Get company information and statistics",
    parameters: getCompanyInfoSchema,
  });
};

export const getRecommendationsTool = () => {
  return tool(getRecommendationsWrapper, {
    name: "get_recommendations",
    description: "Get analyst recommendations for a stock",
    parameters: getRecommendationsSchema,
  });
};

export const getTrendingSymbolsTool = () => {
  return tool(getTrendingSymbolsWrapper, {
    name: "get_trending_symbols",
    description: "Get trending symbols from Yahoo Finance",
    parameters: getTrendingSymbolsSchema,
  });
};

export const getMarketSummaryTool = () => {
  return tool(getMarketSummaryWrapper, {
    name: "get_market_summary",
    description: "Get market summary with major indices",
    parameters: getMarketSummarySchema,
  });
};

export const getNewsTool = () => {
  return tool(getNewsWrapper, {
    name: "get_news",
    description: "Search for news articles related to a query",
    parameters: getNewsSchema,
  });
};

export const getOptionsTool = () => {
  return tool(getOptionsWrapper, {
    name: "get_options",
    description: "Get options data for a stock symbol",
    parameters: getOptionsSchema,
  });
};

export const getInsightsTool = () => {
  return tool(getInsightsWrapper, {
    name: "get_insights",
    description: "Get insights and analysis for a stock",
    parameters: getInsightsSchema,
  });
};

export const getDailyGainersTool = () => {
  return tool(getDailyGainersWrapper, {
    name: "get_daily_gainers",
    description: "Get stocks with the highest gains for the day",
    parameters: getDailyGainersSchema,
  });
};

export const getDailyLosersTool = () => {
  return tool(getDailyLosersWrapper, {
    name: "get_daily_losers",
    description: "Get stocks with the highest losses for the day",
    parameters: getDailyLosersSchema,
  });
};

export const getChartTool = () => {
  return tool(getChartWrapper, {
    name: "get_chart",
    description: "Get chart data for a stock symbol",
    parameters: getChartSchema,
  });
};

export const getQuoteSummaryTool = () => {
  return tool(getQuoteSummaryWrapper, {
    name: "get_quote_summary",
    description: "Get comprehensive quote summary with various modules",
    parameters: getQuoteSummarySchema,
  });
};

// Export all tools as an array for convenience
export const getAllYahooFinanceTools = () => [
  getQuoteTool(),
  getHistoricalDataTool(),
  searchSymbolsTool(),
  getCompanyInfoTool(),
  getRecommendationsTool(),
  getTrendingSymbolsTool(),
  getMarketSummaryTool(),
  getNewsTool(),
  getOptionsTool(),
  getInsightsTool(),
  getDailyGainersTool(),
  getDailyLosersTool(),
  getChartTool(),
  getQuoteSummaryTool(),
];

// Export individual tools by category
export const basicYahooFinanceTools = () => [
  getQuoteTool(),
  searchSymbolsTool(),
  getCompanyInfoTool(),
  getMarketSummaryTool(),
];

export const advancedYahooFinanceTools = () => [
  getHistoricalDataTool(),
  getChartTool(),
  getQuoteSummaryTool(),
  getOptionsTool(),
];

export const analysisYahooFinanceTools = () => [
  getRecommendationsTool(),
  getInsightsTool(),
  getDailyGainersTool(),
  getDailyLosersTool(),
];

export const newsYahooFinanceTools = () => [
  getNewsTool(),
  getTrendingSymbolsTool(),
];
