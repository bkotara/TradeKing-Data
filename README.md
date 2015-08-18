TradeKing-Data
=========

Node.js version of TradeKing's API for streaming/getting stock/option data.

## Installation

  npm install tradeking-data

## Usage

```javascript
  var tradeking = require('tradeking-data')

  var TradeKing = new tradeking(
    {
      consumer_key: <key>, 
      consumer_secret: <secret>, 
      access_token: <token>, 
      access_secret: <secret>
    }
  );
  
  TradeKing.openStream(["AAPL", "MSFT"]).then(function(stream) {
    stream.on("data", function(data) {
      handle(data);
    });
  }).catch(function(error) {
    handle(error);
  });

  TradeKing.getMarketClock().then(function(data) {
    handle(data);
  }).catch(function(error) {
    handle(error):
  });

  TradeKing.getQuotesForSymbols(["AAPL"]).then(function(data) {
    handle(data);
  }).catch(function(error) {
    handle(error):
  });

  TradeKing.getStrikesForSymbol("AAPL").then(function(data) {
    handle(data);
  }).catch(function(error) {
    handle(error):
  });

  TradeKing.getOptionExpirationsForSymbol("AAPL").then(function(data) {
    handle(data);
  }).catch(function(error) {
    handle(error):
  });

  TradeKing.getTimeSalesForSymbols({
    symbols: ["AAPL"],
    startdate: "2012-04-06",
    interval: "1min"
  }).then(function(data) {
    handle(data);
  }).catch(function(error) {
    handle(error):
  });

  TradeKing.getTopLists("toppctlosers").then(function(data) {
    handle(data);
  }).catch(function(error) {
    handle(error):
  });
```
## Notes

  For highly repetitve calls where streams are not used, generate your own endpoint and GET from it directly via getDataFromEndpoint(endpoint). This is far more efficient.

  For migrating from 1.0.0 to 1.1.0, getStockData is now getQuotesForSymbols. Also, the constructor no longer takes symbols and fields. Generate an endpoint and use getDataFromEndpoint(endpoint) if static use is necessary.

  The following functions are built out, but have not obtained useable data from TradeKing.com:
    getNews
    getArticleById
    searchOptionsForSymbol

## Release History

* 0.1.0 Initial release
* 1.0.0 Introdcued promises to API
* 1.1.0 Added functionality for all TradeKing market calls
