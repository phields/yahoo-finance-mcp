// Example usage for both MCP and LlamaIndex integration

import { getAllYahooFinanceTools, basicYahooFinanceTools, getQuoteTool } from "./llamaindex-tools.js";
import { getQuote } from "./tools.js";

// ==== LlamaIndex Usage Example ====

// 1. Use individual tools
export async function exampleLlamaIndexIndividualTool() {
  const quoteTool = getQuoteTool();
  
  // Call the tool with parameters
  const result = await quoteTool.call({ symbol: "AAPL" });
  console.log("AAPL Quote:", result);
  
  return result;
}

// 2. Use all tools in an agent (example structure)
export function exampleLlamaIndexAllTools() {
  const allTools = getAllYahooFinanceTools();
  
  // This would be used in a LlamaIndex agent like:
  // const agent = agent({
  //   name: "FinanceAgent",
  //   description: "An agent that can help with financial data and analysis",
  //   tools: allTools,
  //   // ... other agent config
  // });
  
  return allTools;
}

// 3. Use categorized tools
export function exampleLlamaIndexCategorizedTools() {
  const basicTools = basicYahooFinanceTools();
  
  // This could be used for a simpler agent that only needs basic functionality
  // const basicAgent = agent({
  //   name: "BasicFinanceAgent", 
  //   description: "A basic financial data agent",
  //   tools: basicTools,
  //   // ... other config
  // });
  
  return basicTools;
}

// ==== Direct Core Function Usage ====

// 4. Use core functions directly
export async function exampleDirectUsage() {
  try {
    // Get a stock quote
    const quote = await getQuote({ symbol: "AAPL" });
    console.log("Direct AAPL Quote:", quote);
    
    return quote;
  } catch (error) {
    console.error("Error getting quote:", error);
    throw error;
  }
}

// ==== MCP Server Usage ====
// The MCP server (mcp-server.ts) can be started separately and used by MCP clients
// To start the MCP server: npm run start or node build/mcp-server.js

// ==== Usage Instructions ====

/* 
For LlamaIndex integration:

1. Import the tools you need:
   import { getAllYahooFinanceTools, basicYahooFinanceTools } from "./llamaindex-tools.js";

2. Use them in your agent:
   import { agent } from "@llamaindex/workflow";
   
   const financeAgent = agent({
     name: "FinanceAgent",
     description: "Financial data analysis agent",
     tools: getAllYahooFinanceTools(),
     // ... other config
   });

3. The agent can now use any of the Yahoo Finance tools automatically.

For MCP usage:

1. Start the MCP server:
   npm run start

2. Connect from an MCP client (like Claude Desktop) using the server configuration.

For direct usage:

1. Import the core functions:
   import { getQuote, getHistoricalData } from "./tools.js";

2. Call them directly:
   const quote = await getQuote({ symbol: "AAPL" });
*/
