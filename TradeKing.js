var OAuth = require('oauth').OAuth;
var _ = require('underscore');

/**
 * Parameters: object credentials, array symbols, array fields.
 * Credentials are required.
 **/
var TradeKing = function(credentials, symbols, fields) {
  this.connection = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");
  this._credentials = credentials
  this.symbols = (_.isArray(symbols)) ? symbols.join():null;
  this.fields = (_.isArray(fields)) ? fields.join():null;
}

TradeKing.prototype.addSymbols = function() {
  if(!_.isString(arguments[0])) {
    return;
  }

  var i = 0;
  if(!_.isString(this.symbols)) {
    this.symbols = arguments[0];
    i++;
  }
  
  while(_.isString(arguments[i])) {
    this.symbols += "," + arguments[i];
    i++;
  }
}

TradeKing.prototype.setSymbols = function(symbols) {
  if(_.isArray(symbols)) {
    this.symbols = symbols.join();
  }
}

TradeKing.prototype.addFields = function() {
  if(!_.isString(arguments[0])) {
    return;
  }

  var i = 0;
  if(!_.isString(this.fields)) {
    this.fields = arguments[0];
    i++;
  }
  
  while(_.isString(arguments[i])) {
    this.fields += "," + arguments[i];
    i++;
  }
}

TradeKing.prototype.setFields = function(fields) {
  if(_.isArray(fields)) {
    this.fields = fields.join();
  }
}

/**
 * Parameters: array symbols
 * Returns a promise with resolve(stream) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.openStream = function(symbols) {
  symbols = (_.isArray(symbols)) ? symbols.join():this.symbols;

  if(!_.isString(symbols)) {
    //error, symbols and callback are needed for this method
    throw new Error("Symbols are reuired for opening streams.")
  }

  var url = "https://stream.tradeking.com/v1/market/quotes.json?symbols=" + symbols;
  return new Promise(function(resolve, reject) {
    var request = this.connection.get(url, this._credentials.access_token, this._credentials.access_secret);
    request.on('response', function(response) {
      response.setEncoding('utf8');
      resolve(response)
    });

    request.on("error", function(error) {
      reject(error)
    });

    request.end();
  }.bind(this));
}

/**
 * Parameters: array symbols, array fields
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getStockData = function(symbols, fields) {
  symbols = (_.isArray(symbols)) ? symbols.join():this.symbols;

  if(!_.isString(symbols)) {
    //error, symbols and callback are needed for this method
    throw new Error("Symbols are reuired for opening streams.")
  }

  fields = (_.isArray(fields)) ? fields.join():this.fields;
  var url = "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=" + symbols;
  if(_.isString(fields)) {
    url += "&fids=" + fields;
  }

  return new Promise(function(resolve, reject) {
    this.__getTradeKingData__(url).then(function(data, response) {
      try {
        var result = JSON.parse(data).response;
        resolve(result);
      } catch(error) {
        reject(error);
      }
    }).catch(function(error) {
      reject(error);
    });
  }.bind(this));
}

TradeKing.prototype.getMarketClock = function() {
  return new Promise(function(resolve, reject) {
    this.__getTradeKingData__("https://api.tradeking.com/v1/market/clock.json").then(function(data, response) {
        try {
          var result = JSON.parse(data).response;
          resolve(result);
        }
        catch(error) {
          reject(error);
        }
    }).catch(function(error) {
      reject(error);
    });
  }.bind(this));
};

TradeKing.prototype.__getTradeKingData__ =  function(url) {
  return new Promise(function(resolve, reject) {
    this.connection.get(url, 
      this._credentials.access_token, 
      this._credentials.access_secret,
      function(error, data, response) {
        if(error) {
          reject(error);
        }
        else {
          resolve(data, response);
        }
      }
    );
  }.bind(this));
}

module.exports = TradeKing;
