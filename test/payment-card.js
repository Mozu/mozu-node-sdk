'use strict';
var url = require('url');
var EnvUrls = require('mozu-metadata/data/environments.json');
var ProdUrls = EnvUrls['Production/Sandbox'];
var test = require('tape');
var jort = require('jort');
var bodyParser = require('body-parser');

var PublicCardClient = require('../clients/commerce/payments/publicCard');
var FiddlerProxy = require('../plugins/fiddler-proxy');
var testContext = require('./_test-context');
var shouldTestLive = require('./_should-test-live');

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
    function runTest(url) {
      var client = PublicCardClient({
        context: testContext,
        plugins: [FiddlerProxy()]
      });
      client.context.basePciUrl = url;
      client.create(cardPayload, {
        scope: 'NONE'
      }).then(function(result) {
        assert.ok(result.id, "result delivered with card id");
      })
    }
    if (shouldTestLive()) {
      assert.plan(1);
      runTest();
    } else {
      assert.plan(2);
      jort(
        {
          id: '123456'
        },
        {
          use: [
            bodyParser.json(),
            function(req, res, next) {
              assert.deepEqual(req.body, cardPayload, 'method sent card payload');
              next();
            }
          ],
          ipv6: false
        }
      ).then(runTest);
    }
});

function testPciPodDetection(tenantId, sandbox) {
  return function(assert) {
    assert.plan(3);
    jort(
      {
        id: tenantId,
        isDevTenant: sandbox
      },
      {
        ipv6: false
      }
    ).then(function(fixture) {
      var client = PublicCardClient({
        context: {
          appKey: '12345',
          sharedSecret: '651iyft',
          baseUrl: ProdUrls.homeDomain,
          tenantId: tenantId
        },
        plugins: [function(client) {
          var makeUrl = client.urlResolver;
          client.urlResolver = function(me, tpt, body) {
            if (~tpt.indexOf('platform/tenants')) {
              assert.pass('calls getTenant to find out tenant status');
              return fixture;
            }
            return makeUrl(me, tpt, body);
          };
          var previousTransform = client.requestTransform ||
            function(x) { return x; };
          client.requestTransform = function(conf) {
            if (conf.url === fixture)
              return previousTransform(conf);
            var u = url.parse(conf.url);
            assert.equal(
              u.protocol + '//' + u.host,
              sandbox ?
                ProdUrls.paymentServiceSandboxDomain
                  :
                ProdUrls.paymentServiceTenantPodDomain,
              'set URL based on pcipod metadata'
            );
            throw new Error("DONE");
          };
        }]
      });
      return client.create(cardPayload, {
        scope: 'NONE'
      }).then(
        function(result) {
          assert.fail('created card despite exception in transform');
        },
        function(error) {
          if (error.message === "DONE") {
            assert.pass('canceled request once pciPod url is demonstrated');
          } else {
            throw error;
          }
        }
      );
    }).catch(assert.end);
  }
}
test(
  'payments/publicCard can derive production pciPod from homePod',
  testPciPodDetection(54321, false)
);
test(
  'payments/publicCard can derive sandbox pciPod from homePod',
  testPciPodDetection(65432, true)
);
