'use strict';

var test = require('tape');
var isRequestValid = require('../security/is-request-valid');
var testContext = require('./_test-context');

var requestOptionsFromEvent = {
  headers: {
  },
};

test(
  'validates requests sent from Mozu', function (assert) {
    assert.plan(2);
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
    
  }
  );