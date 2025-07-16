# Yahoo Finance MCP Server

A Model Context Protocol (MCP) server that provides access to Yahoo Finance data for stock quotes, financial news, and market information.

## Features

- 📈 Real-time stock quotes and historical data
- 📰 Financial news and market updates
- 📊 Company information and financial metrics
- 🔍 Symbol search and lookup
- 📋 Market summaries and indices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yahoo-finance-mcp.git
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

## Usage

### As a standalone server

```bash
npm start
```

### Development

```bash
npm run dev
```

### Configuration

Create a `.env` file in the root directory with any necessary configuration:

```env
# Add any required environment variables here
```

## Available Tools

The MCP server provides the following tools:

### `get_quote`
Get current stock quote information.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL", "GOOGL")

### `get_historical_data`
Get historical stock data.

**Parameters:**
- `symbol` (required): Stock symbol
- `period1` (optional): Start date (YYYY-MM-DD) or period like '1mo', '1y' (default: '1y')
- `period2` (optional): End date (YYYY-MM-DD) or 'now' (default: 'now')
- `interval` (optional): Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (default: '1d')

### `search_symbols`
Search for stock symbols.

**Parameters:**
- `query` (required): Search query

### `get_company_info`
Get company information and statistics.

**Parameters:**
- `symbol` (required): Stock symbol

### `get_recommendations`
Get analyst recommendations for a stock.

**Parameters:**
- `symbol` (required): Stock symbol

### `get_trending_symbols`
Get trending symbols from Yahoo Finance.

**Parameters:**
- `region` (optional): Region (US, GB, CA, etc.) (default: 'US')

### `get_market_summary`
Get market summary with major indices.

**Parameters:** None

## Resources

The server provides access to:
- Stock market data via `yahoo-finance://market-summary`
- Trending symbols via `yahoo-finance://trending-symbols`
- Real-time quotes and historical data
- Company information and analyst recommendations

## Development

### Linting

```bash
npm run lint
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Disclaimer

This project is for educational and informational purposes only. It is not intended for financial advice or trading recommendations. Always do your own research before making investment decisions.
