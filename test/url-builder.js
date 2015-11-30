'use strict';
var test = require('tape');

var opts = {
  cvv: "123",
  cardType: "visa",
  expireMonth: "11",
  expireYear: "19",
  cardHolderName: "Demo User",
  cardIssueNumber: "4111111111111111",
  cardIssueMonth: "01",
  cardIssueYear: "14"
};


test('provides an informative error if your client context does not include a required base url', 
     function(assert) {
    assert.plan(2);
    var client = require('../clients/commerce/payments/publicCard')();
    delete client.context.basePciUrl;
    client.create(opts, {
      scope: 'NONE'
    }).then(function() {
      assert.fail('throws pci pod error');
    }, function(err) {
      assert.ok(err, 'error threw');
      assert.ok(err.message.indexOf('Could not make URL from template') === 0, 'error threw');
    });
  });
