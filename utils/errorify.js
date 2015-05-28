module.exports = function errorify(res) {
  "use strict";
  if (typeof res === "string") {
    return new Error(res);
  }
  var message = res.message || res.body && res.body.message;
  var err;
  var stringBody = typeof res.body === "string" ? res.body : (Buffer.isBuffer(res.body) ? res.body.toString() : null);
  var parsedBody;

  if (!message && stringBody) {
    try {
      parsedBody = JSON.parse(stringBody);
      message = parsedBody.message || stringBody;
    } catch(e) {
      message = stringBody;
    }
  }

  err = new Error(message || "Unknown error!");
  err.originalError = parsedBody || stringBody || res.body;
  return err;
};