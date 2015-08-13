TradeKing-Data
=========

Node.js version of TradeKing's API for streaming/getting stock data.

## Installation

  npm install tradeking

## Usage

  var tradeking = require('tradeking')
      tradekingStream = new tradeking(
      	{
      		consumer_key: <key>, 
      		consumer_secret: <secret>, 
					access_token: <token>, 
					access_secret: <secret>
				}
			);
			tradekingStream.openStream(["AAPL", "MSFT"], function(error, response) {
				if(error) {
					handle(error);
					return;
				}
				handle(response);
			})

## Tests

  No tests at this time

## Release History

* 0.1.0 Initial release