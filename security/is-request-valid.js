'use strict';

var hashStream = require('./hash-stream'),
  concat = require('concat-stream'),
  constants = require('../constants'),
  url = require('url'),
  util = require('util'),
  defaultTimeout = constants.capabilityTimeoutInSeconds;

module.exports = function isRequestValid(context, req, cb) {

  if (!req) {
    return cb(new Error("The request object cannot be null."));
  }

  if (!context || !context.sharedSecret) {
    return cb(new Error("Your context must contain a sharedSecret property."));
  }

  if (!req.body) {
    return cb(new Error("The request object must contain a body."));
  }
  
  var timeout = context.capabilityTimeoutInSeconds || defaultTimeout;
  var uri = (req.url ? url.parse(req.url, true) : null);

  if (uri.query.messageHash && uri.query.dt) {
    var headers = req.headers,
      queryString = uri.query,
      requestDate = new Date(queryString.dt),
      currentDate = new Date(),
      diff = (currentDate - requestDate) / 1000,
      messageHash = decodeURIComponent(queryString.messageHash);

    var bodyString = "";

    if (typeof req.body === 'object') {
      var bodyKeys = Object.keys(req.body);

      for (var i = 0; i < bodyKeys.length; i++) {
        bodyString += (bodyKeys[i] + '=' + req.body[bodyKeys[i]]);
        if (i < (bodyKeys.length - 1)) {
          bodyString += '&';
        }
      }
    } else if (typeof req.body === 'string') {
      bodyString = decodeURIComponent(req.body);
    } else {
      return cb(new Error("Unable to process the request body on the incoming request object. Please structure the body on your request as an object or a string. This utility does not process buffers."));
    }
    
    req.pipe(hashStream(context.sharedSecret, queryString.dt, bodyString)).pipe(concat(function (hash) {
      if (hash !== messageHash || diff > timeout) {
        return cb(new Error(util.format("Unauthorized access from %s, %s, %s Computed: %s", headers.host, messageHash, queryString.dt, hash)));
      } else {
        return cb(null);
      }
    }));
  } else if (req.headers.date && req.headers[constants.headerPrefix + constants.headers['SHA256']]) {
    var body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    headers = req.headers;
    requestDate = new Date(headers.date);
    currentDate = new Date();
    diff = (currentDate - requestDate) / 1000;

    req.pipe(hashStream(context.sharedSecret, headers.date, body)).pipe(concat(function (hash) {
      if (hash !== headers[constants.headerPrefix + constants.headers['SHA256']] || diff > timeout) {
        return cb(new Error(util.format("Unauthorized access from %s, %s, %s Computed: %s", headers.host, headers[constants.headerPrefix + constants.headers['SHA256']], headers.date, hash)));
      } else {
        return cb(null);
      }
    }));
  } else {
    return cb(new Error("No headers or query parameters from Mozu are present on the request object. An error occured, this request is malformed, or this request did not originate from Mozu."));
  }

};