'use strict';

var test = require('tape');
var isRequestValid = require('../security/is-request-valid');
var testContext = require('./_test-context');
testContext.capabilityTimeoutInSeconds = 1000000000;
var http = require('http');
var PORT = 3000;
var request = require('request');

var date = "Wed, 21 Oct 2015 16:29:00 GMT";
/*
To create SHA256 base64 hash, these values were used:
sharedSecret = 12345
date = Wed, 21 Oct 2015 16:29:00 GMT
body = {"testField":"testing","testField2":"123"}
*/
//sharedSecret + sharedSecret => sharedSecretHash, then sharedSecretHash + date + JSON.stringify(bodyObject) => shaHash
var shaHash = "1zdGTsz90yismsqx7r7QVugUtQDblFo0F/6TqOb9yt0=";
/*
To create SHA256 base64 hash, these values were used:
sharedSecret = 12345
date = Wed, 21 Oct 2015 16:29:00 GMT
body = testField=testing&testField2=123
*/
//sharedSecret + sharedSecret => sharedSecretHash, then sharedSecretHash + date + formBody => shaHashFormBody --URL encoded
var shaHashFormBody = "EL7O7tO8tZZ6OsaLtKouq8MhHMA%2BV5CbIWfi4K%2BXnc4%3D"
var urlWithQueryParams = "http://localhost:" + PORT + "/?tenantId=54321&messageHash=" + shaHashFormBody + "&dt=Wed%2C+21+Oct+2015+16%3A29%3A00+GMT";
var bodyObject = {
  "testField": "testing",
  "testField2": "123"
}
var formBody = "testField=testing&testField2=123";

var requestOptionsFromEvent = {
  headers: {
    date: date,
    "x-vol-hmac-sha256": shaHash,
    "request-type": "from-event"
  },
  body: bodyObject,
  url: "http://localhost:" + PORT,
  method: "POST",
  json: true
};

var requestOptionsFromConfigOrSubNav = {
  headers: {
    "request-type": "from-config-or-subnav"
  },
  body: formBody,
  url: urlWithQueryParams,
  method: "POST"
};

test(
  'validates requests sent from Mozu', function (assert) {
    assert.plan(4);
    isRequestValid(testContext, null, function (err) {
      if (err) {
        assert.equal(err.message, "The request object cannot be null.", "validation returned that the request body cannot be null.");
      } else {
        assert.fail('should have called an error -- request body cannot be null.');
      }
    });

    isRequestValid(null, requestOptionsFromEvent, function (err) {
      if (err) {
        assert.equal(err.message, "Your context must contain a sharedSecret property.", 'validation returned that the sharedSecret cannot be null.')
      } else {
        assert.fail('should have called an error -- sharedSecret cannot be null.');
      }
    });


    var server = http.createServer(function (req, res) {
      req.body = '';
      req.on('data', function (data) {
        req.body += data;
      });
      req.on('end', function () {
        isRequestValid(testContext, req, function (err) {
          if (err) {
            assert.fail(err.message, 'validation should have returned successfully.')
          } else {
            if(req.headers['request-type'] === 'from-event') {
              assert.pass('validated request sent by event.');
            }
            
            if(req.headers['request-type'] === 'from-config-or-subnav') {
              assert.pass('validated request sent by configuration url or subnavlink.');
            }
          }
        });
      });
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('okay');
    });

    server.listen(PORT, '127.0.0.1');
    
    request(requestOptionsFromEvent, function() {
      request(requestOptionsFromConfigOrSubNav, function() {
        server.close();
      });
    });
    
  }
  );