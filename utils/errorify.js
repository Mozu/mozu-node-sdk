var extend = require('./tiny-extend');
var util = require('util');
module.exports = function errorify(res, additions) {
  "use strict";
  try {
    if (typeof res === "string") {
      return new Error(res);
    }
    
    var err;
    var message = res.message || res.body && res.body.message;
    var stringBody = typeof res.body === "string" ? res.body : (Buffer.isBuffer(res.body) ? res.body.toString() : null);
    var details = typeof res.body === "object" ? res.body : (typeof res === "object" ? res : {});

    if (!message && stringBody) {
      try {
        details = JSON.parse(stringBody);
        message = details.message || stringBody;
      } catch(e) {
        message = stringBody;
      }
    }

    if (additions) {
      extend(details, additions);
    }

    message = (message || "Unknown error!") + formatDetails(details);

    err = new Error(message);
    err.originalError = details;
    return err;
  } catch(e) {
    return e;
  }
};

function formatDetails(deets) {
  return "\n\nDetails:\n" + Object.keys(deets).map(function(label) {
    var deet = deets[label];
    if (typeof deet === "object") deet = util.inspect(deet);
    return " " + label + ": " + deet;
  }).join('\n') + '\n';
}
