'use strict';

var crypto = require('crypto');

function makeHashStream() {
  var h = crypto.createHash('sha256');
  h.setEncoding('base64');
  return h;
}

module.exports = function hashStream(secretKey, date, body) {
  var hash1 = makeHashStream();
  var hash2 = makeHashStream();

  hash1.write(secretKey + secretKey);
  hash1.end();
  var sha256key = hash1.read();

  hash2.write(sha256key);

  hash2.write(date);

  hash2.write(body);

  return hash2;
};