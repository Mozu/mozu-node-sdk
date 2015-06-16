var setupAssertions = require('./utils/setup-assertion-library');
var SDK = require('../');

describe('Client context headers', function() {

  var client;

  before(setupAssertions);
  beforeEach(function() {
    client = SDK.client({
      masterCatalog: 5,
      'dataview-mode': 'PENDING',
      appClaims: 'camelClaims',
      'app-claims': 'dash-claims',
      'user-claims': 'dash-claims',
      userCLaims: 'camelClaims'
    })
  })

  it('can be provided in dash case or camel case', function() {
    client.context['master-catalog'].should.equal(5);
    client.context['dataview-mode'].should.equal('PENDING');
  });

  it('always prefers camel case', function() {
    client.context['app-claims'].should.equal('dash-claims');
    client.context['user-claims'].should.equal('dash-claims');
  });
  
});