var jort = require('jort');
var setupChai = require('./utils/setup-assertion-library');
var FiddlerProxy = require('../plugins/fiddler-proxy');
var testContext = require('../mozu.test.config.json')
var DeveloperAuthTicketClient = require(
  '../clients/platform/developer/developerAdminUserAuthTicket');
var AppDevClient = require(
  '../clients/platform/application');

describe('Developer service', function() {

  before(setupChai);
  this.timeout(20000);

  var fakeAuthTicket = {
    accessToken: 'accessToken',
    accessTokenExpiration: 'accessTokenExpiration',
    refreshToken: 'refreshToken',
    refreshTokenExpiration: 'refreshTokenExpiration'
  };

  function run(conf) {
    it(conf.it, function() {
      var steps = [
        fakeAuthTicket,
        [
          conf.fixture,
          {
            use: function(req, res, next) {
              conf.validateRequest(req);
              next();
            }
          }
        ]
      ]
      return jort.steps(steps).then(function(uri) {
        var context = JSON.parse(JSON.stringify(testContext));
        context.baseUrl = uri;
        var client = new conf.useClient({
          plugins: [FiddlerProxy],
          context: context
        });
        return conf.test(client).then(conf.validateResponse)
          .should.not.be.rejected;
      });
    });
  }

  it('gets an developer auth ticket without requiring claims',
    function() {
    jort(fakeAuthTicket, {
      use: function(req, res, next) {
        req.headers.should.not.have.property('x-vol-app-claims');
        req.headers.should.not.have.property('x-vol-user-claims');
      }
    }).then(function(uri) {
      var context = JSON.parse(JSON.stringify(testContext));
      context.baseUrl = uri;
      var client = new DeveloperAuthTicketClient({
        plugins: [FiddlerProxy],
        context: context
      });
      return client.createDeveloperUserAuthTicket({
        emailAddress: 'fake@fake.com',
        password: 'fake'
      }, {
        scope: 'NONE'
      }).should.eventually.have.property('accessToken');
    });
  });


  run({
    it: 'calls /developer/packages/{appkey}/metadata with no app claim',
    fixture: {
      metadataSuccess: true
    },
    useClient: AppDevClient,
    test: function(client) {
      return client.getPackageMetadata({
        applicationKey: 'appkey'
      }, {
        scope: 'DEVELOPER'
      });
    },
    validateRequest: function(req) {
      req.headers.should.not.have.property('x-vol-app-claims');
      req.headers.should.have.property('x-vol-user-claims')
        .that.equals(fakeAuthTicket.accessToken);
    }
  });

});
