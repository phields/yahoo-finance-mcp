#!/usr/bin/env node
/**
 * 集成测试脚本 - 验证所有三种使用方式
 */

const { getQuote, searchSymbols } = require('./build/tools.js');

async function testDirectUsage() {
  console.log('🧪 Testing Direct Function Usage...');
  
  try {
    // 测试获取报价
    console.log('  - Testing getQuote...');
    const quote = await getQuote({ symbol: 'AAPL' });
    console.log(`    ✅ AAPL price: $${quote.regularMarketPrice}`);
    
    // 测试搜索
    console.log('  - Testing searchSymbols...');
    const results = await searchSymbols({ query: 'Apple' });
    console.log(`    ✅ Found ${results.quotes.length} symbols`);
    
    console.log('✅ Direct usage test passed!\n');
    return true;
  } catch (error) {
    console.error('❌ Direct usage test failed:', error.message);
    return false;
  }
}

async function testLlamaIndexImport() {
  console.log('🦙 Testing LlamaIndex Tools Import...');
  
  try {
    const { allYahooFinanceTools, quotingTools } = require('./build/llamaindex-tools.js');
    console.log(`    ✅ Loaded ${allYahooFinanceTools.length} total tools`);
    console.log(`    ✅ Loaded ${quotingTools.length} quoting tools`);
    console.log('✅ LlamaIndex import test passed!\n');
    return true;
  } catch (error) {
    console.error('❌ LlamaIndex import test failed:', error.message);
    return false;
  }
}

async function testMCPImport() {
  console.log('🔌 Testing MCP Server Import...');
  
  try {
    const mcpModule = require('./build/mcp-server.js');
    console.log('    ✅ MCP server module loaded successfully');
    console.log('✅ MCP import test passed!\n');
    return true;
  } catch (error) {
    console.error('❌ MCP import test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Yahoo Finance MCP - Integration Test\n');
  
  const results = await Promise.all([
    testDirectUsage(),
    testLlamaIndexImport(),
    testMCPImport()
  ]);
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`📊 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! The library is ready for dual compatibility use.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch(console.error);
