var test = require('tape');
var jort = require('jort');

var LegacySDK = require('../');
var DocumentListClient = require(
  '../clients/content/documentlists/document');

var FiddlerProxy = require('../plugins/fiddler-proxy');

var testContext;
var testContentService = function(assert, client) {
  assert.plan(3);
  client.getDocuments({
    pageSize: 3,
    documentListName: "files@mozu"
  }).then(function(result) {
    assert.ok(result, 'result delivered');
    assert.equal(result.pageSize, 3, 'pagesize as expected');
    assert.equal(result.items.length, 3, 'items as expected');
  }).catch(assert.fail);
};

var runTests;

if (process.env.MOZU_TEST_LIVE) {
  try {
    testContext = require('mozu.test.config.json');
  } catch(e) {}
  runTests = function(client) {
    return function(assert) {
      testContentService(assert, client);
    }
  }
} else {
  runTests = function(client) {
    return function(assert) {
      jort({
        pageSize: 3,
        items: [
          {},
          {},
          {}
        ]
      }).then(function(serviceUrl) {
        client.context.tenantPod = serviceUrl;
        testContentService(assert, client);
      });
    }
  };
}

test(
  'content/documentlists/document returns Documents',
  runTests(new DocumentListClient({ 
    context: testContext,
    plugins: [FiddlerProxy] 
  })));

