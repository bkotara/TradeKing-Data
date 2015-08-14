var OAuth = require('oauth').OAuth;
var _ = require('underscore');

/**
 * Parameters: object credentials, array symbols, array fields.
 * Credentials are required.
 **/
var TradeKing = function(credentials, symbols, fields) {
  this.connection = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");
  this._credentials = credentials
  this.streamIsRunning = false;
  this.stream = null;
  this.symbols = (_.isArray(symbols)) ? symbols.join():null;
  this.fields = (_.isArray(fields)) ? fields.join():null;
}

/**
 * Parameters: array symbols, function callback(error, response).
 * If symbols is not provided, pass null for its value.
 * The callback function is required.
 **/
TradeKing.prototype.openStream = function(symbols, callback) {
  symbols = (_.isArray(symbols)) ? symbols.join():this.symbols;

  if(!_.isString(symbols) || !_.isFunction(callback)) {
    //error, symbols and callback are needed for this method
    throw new Error("Symbols and a callback funtion are reuired for opening streams.")
  }

  var url = "https://stream.tradeking.com/v1/market/quotes.json?symbols=" + symbols;
  var request = this.connection.get(url, 
    this._credentials.access_token, 
    this._credentials.access_secret);

  request.on('response', function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      var result;
      try {
        result = JSON.parse(data);
        process.nextTick(function() {
          callback(null, result)
        });
      }
      catch(error) {
        process.nextTick(function() {
          callback(error)
        });
      }
    });
    this.stream = response
    this.streamIsRunning = true
  });
  request.end();
}

TradeKing.prototype.pauseStream = function() {
  if(this.streamIsRunning === true) {
    this.stream.pause();
    this.streamIsRunning = false;
  }
}

TradeKing.prototype.resumeStream = function() {
  if(this.streamIsRunning === false) {
    this.stream.resume();
    this.streamIsRunning = true;
  }
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
 * Parameters: array symbols, array fields, function callback(error, response).
 * If symbols or fields are not provided, pass null for their values.
 **/
TradeKing.prototype.getStockData = function(symbols, fields, callback) {
  symbols = (_.isArray(symbols)) ? symbols.join():this.symbols;

  if(!_.isString(symbols) || !_.isFunction(callback)) {
    //error, symbols and callback are needed for this method
    throw new Error("Symbols and a callback funtion are reuired for opening streams.")
  }

  fields = (_.isArray(fields)) ? fields.join():this.fields;

  var url = "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=" + symbols;
  if(_.isString(fields)) {
    url += "&fids=" + fields;
  }

  this.connection.get(url, 
    this._credentials.access_token, 
    this._credentials.access_secret,
    function(error, data, response) {
      if(error) {
        process.nextTick(function() {
          callback(error)
        });
      }
      else {
        try {
          var result = JSON.parse(data).response;
          process.nextTick(function() {
            callback(null, result)
          });
        }
        catch(error) {
          process.nextTick(function() {
            callback(error)
          });
        }
      }
    }
  );
};

module.exports = TradeKing;
