# Yahoo Finance MCP Server

[![npm version](https://badge.fury.io/js/yahoo-finance-mcp.svg)](https://badge.fury.io/js/yahoo-finance-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides access to Yahoo Finance data for stock quotes, financial news, and market information. This server enables AI assistants to access real-time and historical financial data through the MCP protocol.

## Features

- 📈 **Real-time stock quotes** and historical data
- 📰 **Financial news** and market updates  
- 📊 **Company information** and financial metrics
- 🔍 **Symbol search** and lookup functionality
- 📋 **Market summaries** and major indices
- 🎯 **Trending symbols** by region
- 📈 **Analyst recommendations** and ratings
- 🌐 **Multi-region support** (US, GB, CA, etc.)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Available Tools](#available-tools)
- [Resources](#resources)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Method 1: Install from npm (Recommended)

```bash
npm install -g yahoo-finance-mcp
```

### Method 2: Build from source

1. Clone the repository:
```bash
git clone https://github.com/phields/yahoo-finance-mcp.git
cd yahoo-finance-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Method 3: Using npx (No installation required)

```bash
npx yahoo-finance-mcp
```

## Usage

### With Claude Desktop

To use this server with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "npx",
      "args": ["yahoo-finance-mcp"]
    }
  }
}
```

### With other MCP clients

The server can be used with any MCP-compatible client. Start the server and connect to it using the MCP protocol.

### As a standalone server

```bash
npm start
```

### Development mode

```bash
npm run dev
```

### Configuration

Create a `.env` file in the root directory with any necessary configuration:

```env
# Optional: Set custom port (default: 3000)
PORT=3000

# Optional: Enable debug logging
DEBUG=true

# Optional: Set request timeout (default: 30000ms)
REQUEST_TIMEOUT=30000
```

## Available Tools

The MCP server provides the following tools for financial data access:

### `get_quote`
Get current stock quote information including price, volume, and market cap.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL", "GOOGL", "TSLA")

**Example:**
```json
{
  "symbol": "AAPL"
}
```

### `get_historical_data`
Get historical stock data with flexible date ranges and intervals.

**Parameters:**
- `symbol` (required): Stock symbol
- `period1` (optional): Start date (YYYY-MM-DD) or period like '1mo', '1y' (default: '1y')
- `period2` (optional): End date (YYYY-MM-DD) or 'now' (default: 'now')
- `interval` (optional): Data interval - 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo (default: '1d')

**Example:**
```json
{
  "symbol": "AAPL",
  "period1": "2024-01-01",
  "period2": "2024-12-31",
  "interval": "1d"
}
```

### `search_symbols`
Search for stock symbols by company name or ticker.

**Parameters:**
- `query` (required): Search query (company name or partial ticker)

**Example:**
```json
{
  "query": "Apple"
}
```

### `get_company_info`
Get detailed company information and key statistics.

**Parameters:**
- `symbol` (required): Stock symbol

**Example:**
```json
{
  "symbol": "AAPL"
}
```

### `get_recommendations`
Get analyst recommendations and ratings for a stock.

**Parameters:**
- `symbol` (required): Stock symbol

**Example:**
```json
{
  "symbol": "AAPL"
}
```

### `get_trending_symbols`
Get trending symbols from Yahoo Finance by region.

**Parameters:**
- `region` (optional): Region code (US, GB, CA, AU, etc.) (default: 'US')

**Example:**
```json
{
  "region": "US"
}
```

### `get_market_summary`
Get market summary with major indices (S&P 500, NASDAQ, Dow Jones, etc.).

**Parameters:** None

**Example:**
```json
{}
```

## Resources

The server provides access to various financial data resources:

- **Market Summary**: `yahoo-finance://market-summary` - Access to major market indices and their current status
- **Trending Symbols**: `yahoo-finance://trending-symbols` - Real-time trending stocks by region
- **Real-time Quotes**: Live stock prices, volumes, and market data
- **Historical Data**: Historical price data with flexible date ranges and intervals
- **Company Information**: Detailed company profiles, statistics, and financial metrics
- **Analyst Recommendations**: Professional analyst ratings and recommendations

## Error Handling

The server includes comprehensive error handling for:
- Invalid stock symbols
- API rate limiting
- Network timeouts
- Market closure periods
- Invalid date ranges

## Rate Limiting

This server respects Yahoo Finance's rate limits and implements:
- Request throttling
- Automatic retry with exponential backoff
- Graceful degradation during high load periods

## Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/phields/yahoo-finance-mcp.git
cd yahoo-finance-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Scripts

- `npm run build` - Build the TypeScript project
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically

### Project Structure

```
yahoo-finance-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript output
├── tests/                # Test files
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`npm test`)
6. Run linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add some amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/phields/yahoo-finance-mcp/issues)
- 💡 **Feature requests**: [GitHub Issues](https://github.com/phields/yahoo-finance-mcp/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/phields/yahoo-finance-mcp/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Disclaimer

⚠️ **Important**: This project is for educational and informational purposes only. It is not intended for financial advice or trading recommendations. Always conduct your own research and consult with qualified financial professionals before making investment decisions.

The data provided by this server is sourced from Yahoo Finance and may be subject to delays, inaccuracies, or interruptions. Use at your own risk.

## Acknowledgments

- [Yahoo Finance](https://finance.yahoo.com/) for providing the financial data
- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification
- [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2) for the Yahoo Finance API wrapper
