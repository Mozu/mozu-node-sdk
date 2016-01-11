'use strict';
var test = require('tape');
var jort = require('jort');

var DocumentListClient = require(
  '../clients/content/documentlists/document');
var testContext = require('./_test-context');
var FiddlerProxy = require('../plugins/fiddler-proxy');
var shouldTestLive = require('./_should-test-live');

var testContentService = function(assert, client) {
  assert.plan(3);
  client.getDocuments(
    {
      pageSize: 3,
      documentListName: "files@mozu"
    },
    {
      scope: 'NONE'
    }
  ).then(function(result) {
    assert.ok(result, 'result delivered');
    assert.equal(result.pageSize, 3, 'pagesize as expected');
    assert.equal(result.items.length, 3, 'items as expected');
  }).catch(assert.fail);
};

var runTests;

if (shouldTestLive()) {
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
      }, { ipv6: false }).then(function(serviceUrl) {
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
    plugins: [FiddlerProxy()] 
  })));

