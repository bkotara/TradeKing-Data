TradeKing-Data
=========

Node.js version of TradeKing's API for streaming/getting stock data.

## Installation

  npm install tradeking-data

## Usage

```javascript
  var tradeking = require('tradeking-data')

  var tradekingStream = new tradeking(
    {
      consumer_key: <key>, 
      consumer_secret: <secret>, 
      access_token: <token>, 
      access_secret: <secret>
    }
  );
  
  tradekingStream.openStream(["AAPL", "MSFT"]).then(function(stream) {
    stream.on("data", function(data) {
      handle(data);
    });
  }).catch(function(error) {
    handle(error);
  });
```

## Release History

* 0.1.0 Initial release
* 1.0.0 Introdcued promises to API