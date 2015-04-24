var setup = require('./utils/config');
var when = require('when');

describe('Mozu Hosted Calls', function() {


    var tenantPod;

    before(function(done) {
        var chai = require('chai');


        chai.should();
        chai.use(require('chai-as-promised'));

        var http = require('http');

        tenantPod = http.createServer(function(request, response) {
            response.writeHead(200, {
                "Content-Type": "text/json"
            });
            tenantPod.handle(request, response);

        });
        tenantPod.listen(1789);
        done();
    });
    after(function(done) {
        tenantPod.close(done);
    });

    this.timeout(20000);



    it('provide a readymade SDK client whose context can be hand-modified', function(done) {




        var client = null,
            assert = require('assert'),
            headersConstants = require('../src/constants').headers,
            errorFn = function(error) {
                console.error(error.message, error);
                done();
            },
            sdkConfig = {
                baseUrl: "http://localhost:1456/",
                tenantPod: "http://localhost:1789/",
            };
        sdkConfig[headersConstants.SITE] = 123;
        sdkConfig[headersConstants.USERCLAIMS] = "fonzie";


        process.env.mozuHosted = JSON.stringify({
            sdkConfig: sdkConfig
        });
        client = require('../').client();



        client.context[headersConstants.USERCLAIMS] = null;
        client.context[headersConstants.SITE] = 23;

        var reachedHandle = [];



        tenantPod.handle = function(req, resp) {

            reachedHandle.push(1);

            assert.ok(!req.headers['x-vol-' + headersConstants.USERCLAIMS], "user claims should be null");
            assert.equal(req.headers['x-vol-' + headersConstants.SITE], 23, 'site doesnt match context change');

            resp.end("{ items:[]}");

        };
        return client.commerce().catalog().admin().product().getProducts({})
            .then(function() {

                tenantPod.handle = function(req, resp) {

                    reachedHandle.push(2);

                    assert.equal(req.headers['x-vol-' + headersConstants.USERCLAIMS], 'fonzie', "should have user claims");
                    assert.equal(req.headers['x-vol-' + headersConstants.SITE], 123, 'site should be restored from process.env');

                    resp.end("{ items:[]}");
                };
                client = require('../').client();
                return client.commerce().catalog().admin().product().getProducts().then(function() {
                    reachedHandle.should.deep.eql([1,2]);
                    done();
                }, errorFn);

            }, errorFn);




    });
});
