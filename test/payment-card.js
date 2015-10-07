var test = require('tape');
var jort = require('jort');
var bodyParser = require('body-parser');

var PublicCardClient = require('../clients/commerce/payments/publicCard');

var FiddlerProxy = require('../plugins/fiddler-proxy');

var testContext = {};
try {
  testContext = require('mozu.test.config.json');
} catch(e) {}

var cardPayload = {
  cvv: "123",
  cardType: "visa",
  expireMonth: "11",
  expireYear: "2019",
  cardHolderName: "Demo User",
  cardNumber: "4111111111111111",
  cardIssueMonth: "01",
  cardIssueYear: "14"
};

test(
  'payments/publicCard sends card data via basePCIUrl',
  { timeout: 20000 },
  function(assert) {
    assert.plan(2);
    jort({
      id: '123456'
    }, {
      use: [
        bodyParser.json(),
        function(req, res, next) {
          assert.deepEqual(req.body, cardPayload, 'method sent card payload');
          next();
        }
      ]
    }).then(function(url) {
      var client = PublicCardClient({
        context: testContext,
        plugins: [FiddlerProxy]
      });
      client.context.basePciUrl = url;
      client.create(cardPayload).then(function(result) {
        assert.ok(result.id, "result delivered with card id");
      })
    })
  });
