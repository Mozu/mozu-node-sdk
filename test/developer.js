'use strict';
var test = require('tape');
var jort = require('jort');
var DeveloperAuthTicketClient = require( '../clients/platform/developer/developerAdminUserAuthTicket');
var AppDevClient = require( '../clients/platform/application');
var testContext = require('./_test-context');

var fakeAuthTicket = {
  accessToken: 'accessToken',
  accessTokenExpiration: 'accessTokenExpiration',
  refreshToken: 'refreshToken',
  refreshTokenExpiration: 'refreshTokenExpiration'
};

test(
  'gets an developer auth ticket without requiring claims',
  function(assert) {
    assert.plan(3);
    jort(fakeAuthTicket, {
      use: function(req, res, next) {
        assert.notOk(req.headers['x-vol-app-claims'],
                     'no app claims sent');
                     assert.notOk(req.headers['x-vol-user-claims'],
                                  'no user claims sent');
                                  next();
      },
      ipv6: false
    }).then(function(uri) {
      var client = new DeveloperAuthTicketClient({
        context: testContext
      });
      client.context.baseUrl = uri;
      client.createDeveloperUserAuthTicket({
        emailAddress: 'fake@fake.com',
        password: 'fake'
      }, {
        scope: 'NONE'
      }).then(function(result) {
        assert.equal(result.accessToken, fakeAuthTicket.accessToken,
                     'auth ticket returned');
      }).catch(assert.fail);
    });
  });

test(
  'calls /developer/packages/{appkey}/metadata with no app claim',
  function(assert) {
    assert.plan(2);
    var steps = [
      fakeAuthTicket,
      [
        {
          metadataSuccess: true
        },
        {
          use: function(req, res, next) {
            assert.notOk(req.headers['x-vol-app-claims'],
                         'no app claims sent');
                         assert.equal(req.headers['x-vol-user-claims'],
                                      fakeAuthTicket.accessToken,
                                      'user claims sent from access token');
                                      next();
          }
        }
      ]
    ];
    jort.steps(steps, { ipv6: false }).then(function(uri) {
      var client = new AppDevClient({
        context: testContext
      });
      client.context.baseUrl = uri;
      client.getPackageMetadata({
        applicationKey: 'appkey'
      }, {
        scope: 'DEVELOPER'
      }).catch(assert.fail);
    });

  });

