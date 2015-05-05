var assert = require('assert')
var setup = require('./utils/config');
var enableDestroy = require('server-destroy');
var when = require('when');
var SDK = require('../');

describe('Mozu Hosted Calls', function() {

    var tenantPod;
    var homePod;

    var blankResponse = JSON.stringify({ items: [] });

    before(function(done) {
        var http = require('http');
        tenantPod = http.createServer(function(request, response) {
            response.writeHead(200, {
                "Content-Type": "text/json"
            });
            tenantPod.handle(request, response);
        });
        tenantPod.listen(1789);
        homePod = http.createServer(function(request, response) {
            response.writeHead(403, {
                "Content-Type": "text/json"
            });
            response.end(JSON.stringify({
                message: 'Should not call home pod in mozuHosted environment with request: ' + request.url
            }));
        });
        homePod.listen(1456);
        enableDestroy(tenantPod);
        enableDestroy(homePod);
        done();
    });

    after(function(done) {
        homePod.destroy(function() {
            tenantPod.destroy(done);
        });
        process.env.mozuHosted = '';
    });

    this.timeout(20000);


    it('provide a readymade SDK client whose context can be hand-modified', function() {
         var client,
            headersConstants = require('../src/constants').headers,
            sdkConfig = {
                baseUrl: "http://localhost:1456/",
                tenantPod: "http://localhost:1789/",
            };
        sdkConfig[headersConstants.SITE] = 123;
        sdkConfig[headersConstants.USERCLAIMS] = "fonzie";

        process.env.mozuHosted = JSON.stringify({
            sdkConfig: sdkConfig
        });

        client = SDK.client();

        client.context[headersConstants.USERCLAIMS] = null;
        client.context[headersConstants.SITE] = 23;

        var reachedHandle = [];

        tenantPod.handle = function(req, resp) {

            reachedHandle.push(1);

            assert.ok(!req.headers['x-vol-' + headersConstants.USERCLAIMS], "user claims should be null");
            assert.equal(req.headers['x-vol-' + headersConstants.SITE], 23, 'site doesnt match context change');

            resp.end(blankResponse);

        };

        return client.commerce().catalog().admin().product().getProducts({}).then(function() {

            tenantPod.handle = function(req, resp) {
                reachedHandle.push(2);
                assert.equal(req.headers['x-vol-' + headersConstants.USERCLAIMS], 'fonzie', "should have user claims");
                assert.equal(req.headers['x-vol-' + headersConstants.SITE], 123, 'site should be restored from process.env');
                resp.end(blankResponse);
            };

            client = SDK.client();

            return client.commerce().catalog().admin().product().getProducts().then(function(s) {
                assert.equal(reachedHandle.join(','),'1,2', 'did not reach both handles');
            });
        });
    });
});
