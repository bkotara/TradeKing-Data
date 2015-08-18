var OAuth = require('oauth').OAuth;
var _ = require('underscore');

/**
 * Parameters: required object credentials
 **/
var TradeKing = function(credentials) {
  this.connection = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");
  this.__credentials__ = credentials;
}

/**
 * Parameters: required array symbols
 * Returns a promise with resolve(stream) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.openStream = function(symbols) {
  var queryObject = {
    symbols: {
      required: true,
      values: symbols
    }
  };
  var url = TradeKing.generateEndpoint("https://stream.tradeking.com/v1/market/quotes", "json", queryObject);
  return new Promise(function(resolve, reject) {
    var request = this.connection.get(url, this.__credentials__.access_token, this.__credentials__.access_secret);
    request.on('response', function(response) {
      response.setEncoding('utf8');
      resolve(response);
    });

    request.on("error", function(error) {
      reject(error);
    });

    request.end();
  }.bind(this));
}

/**
 * Parameters: None
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getMarketClock = function() {
  return this.getDataFromEndpoint("https://api.tradeking.com/v1/market/clock.json");
};

/**
 * Parameters: required array symbols, array fields
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getQuotesForSymbols = function(symbols, fields) {
  var queryObject = {
    symbols: {
      required: true,
      values: symbols
    },
    fields: {
      required: false,
      values: fields
    }
  };
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/ext/quotes", "json", queryObject));
};

/**
 * Parameters: object object containing: 
 *  array keywords, 
 *  array symbols, 
 *  int maxhits, 
 *  required string startdate, 
 *  required string enddate
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getNews = function(object) {
  if(!_.isObject(object)) { throw new Error("A query object is required for getNews"); }
  var queryObject = {
    keywords: {
      required: false,
      values: object.keywords
    },
    symbols: {
      required: false,
      values: object.symbols
    },
    maxhits: {
      required: false,
      values: _.isNumber(object.maxhits) ? [object.maxhits.toString()]:null
    },
    startdate: {
      required: false,
      values: _.isString(object.startdate) ? [object.startdate]:null
    },
    enddate: {
      required: false,
      values: _.isString(object.enddate) ? [object.enddate]:null
    }
  };
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/news/search", "json", queryObject));
};

/**
 * Parameters: string articleId
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getArticleById = function(articleId) {
  if(!_.isString(articleId)) { throw new Error("getArticleById expects a string argument"); }
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/news/" + articleId, "json"));
};

/**
 * Parameters: required string symbols, required array query (unescaped and without ANDs), array fields
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.searchOptionsForSymbol = function(symbol, query, fields) {
  var queryObject = {
    symbol: {
      required: true,
      values: _.isString(symbol) ? [symbol]:null
    },
    query: {
      required: true,
      values: query
    },
    fields: {
      required: false,
      values: fields
    }
  };
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/options/search", "json", queryObject));
};

/**
 * Parameters: required string symbol
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getStrikesForSymbol = function(symbol) {
  var queryObject = {
    symbol: {
      required: true,
      values: _.isString(symbol) ? [symbol]:null
    }
  };
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/options/strikes", "json", queryObject));
};

/**
 * Parameters: required string symbol
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getOptionExpirationsForSymbol = function(symbol) {
  var queryObject = {
    symbol: {
      required: true,
      values: _.isString(symbol) ? [symbol]:null
    }
  };
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/options/expirations", "json", queryObject));
};

/**
 * Parameters: object containing: 
 *  required array symbols, 
 *  string interval, 
 *  int rpp, 
 *  int index, 
 *  required string startdate, 
 *  required string enddate
 *  string starttime
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getTimeSalesForSymbols = function(object) {
  if(!_.isObject(object)) { throw new Error("A query object is required for getTimesalesForSymbols"); }
  var queryObject = {
    symbols: {
      required: true,
      values: object.symbols
    },
    startdate: {
      required: true,
      values: _.isString(object.startdate) ? [object.startdate]:null
    },
    enddate: {
      required: false,
      values: _.isString(object.enddate) ? [object.enddate]:null
    },
    interval: {
      required: true,
      values: _.isString(object.interval) ? [object.interval]:null
    },
    rpp: {
      required: false,
      values: _.isNumber(object.rpp) ? [object.rpp.toString()]:null
    },
    index: {
      required: false,
      values: _.isNumber(object.index) ? [object.index.toString()]:null
    },
    starttime: {
      required: false,
      values: _.isString(object.starttime) ? [object.starttime]:null
    }
  };
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/timesales", "json", queryObject));
};

/**
 * Parameters: string listType (toplosers, toppctlosers, topvolume, etc. from https://developers.tradeking.com/documentation/market-toplists-get)
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 **/
TradeKing.prototype.getTopLists = function(listType) {
  if(!_.isString(listType)) { throw new Error("getTopLists expects a string argument"); }
  return this.getDataFromEndpoint(TradeKing.generateEndpoint("https://api.tradeking.com/v1/market/toplists/" + listType, "json"));
};

/**
 * Parameters: endpoint (fully escaped https url)
 * Returns a promise with resolve(response as JSON) and reject(error) as the possible outcomes
 * Note: Should be used directly whenever a static endpoint is possible (efficiency)
 * Note: Does not work for streams
 **/
TradeKing.prototype.getDataFromEndpoint = function(endpoint) {
  return new Promise(function(resolve, reject) {
    this.connection.get(endpoint, 
      this.__credentials__.access_token, 
      this.__credentials__.access_secret,
      function(error, data, response) {
        if(error) {
          reject(error);
        }
        else {
          try {
            var result = JSON.parse(data).response;
            resolve(result);
          }
          catch(error) {
            reject(error);
          }
        }
      }
    );
  }.bind(this));
};

/**
 * Parameters: string baseUrl, string dataType (json or xml), object queryParameters {symbols: {required: true, values: []}} (use for symbols, fields, query, etc.) (all values are arrays)
 * Returns a completely escaped url string
 * Note: Should be used directly whenever a static endpoint is possible (efficiency)
 * Note: Will throw errors from queryParameter validation
 **/
TradeKing.generateEndpoint = function(baseUrl, dataType, queryParameters) {
  var endpoint = baseUrl + "." + dataType;
  if(!_.isObject(queryParameters) || Object.keys(queryParameters).length <= 0) {
    console.log(endpoint);
    return endpoint;
  }

  endpoint += "?";
  var queryStrings = [];
  _.each(queryParameters, function(value, key) {
    if(!TradeKing.__validateQueryParameter__(value, key)) {
      return;
    }

    var tempString = key + "=";
    if(key === "query") {
      tempString += value.values.join("%20AND%20");
      tempString = tempString.replace(/:\s*/g, "%3A");
    } else {
      tempString += value.values.join();
    }
    queryStrings.push(tempString);
  });
  console.log(endpoint + queryStrings.join("&"));
  return endpoint + queryStrings.join("&");
};

/**
 * Parameters: object value: {required: true, values: []}, string key: (symbols, fields, query, etc.)
 * Returns true if valid, false if not. Throws an error if a required parameter is invalid.
 **/
TradeKing.__validateQueryParameter__ = function(value, key) {
  var isValid = false;
  if(value.required ===  true) {
    if(!_.isArray(value.values) || value.values.length <= 0) {
      throw new Error("Required parameter is invalid or missing: " + key);
    } 
    isValid = true;
  } else {
    isValid = _.isArray(value.values) ? ((value.values.length > 0)? true:false):false;
  }

  if(isValid === true) {
    _.each(value.values, function(item) {
      if(!_.isString(item)) { throw new Error("A query parameter has invalid values: " + key); }
    });
  }
  return isValid;
};

module.exports = TradeKing;
