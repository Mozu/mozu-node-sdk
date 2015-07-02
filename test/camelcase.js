var setupAssertions = require('./utils/setup-assertion-library');
var SDK = require('../');

describe('Client context headers', function() {

  var client;

  before(setupAssertions);
  beforeEach(function() {
    client = SDK.client({
      'dataview-mode': 'PENDING',
      appClaims: 'camelClaims',
      'app-claims': 'dash-claims',
      'user-claims': 'dash-claims',
      userClaims: 'camelClaims',
      siteId: 'camelId',
      catalogId: 'camelId',
      masterCatalogId: 'camelId',
      tenant: 'lower-tenant',
      site: 'lower-site',
      catalog: 'lower-catalog',
      'master-catalog': 'lower-master-catalog'
    })
  })

  it('can be provided in dash case or camel case', function() {
    client.context['dataview-mode'].should.equal('PENDING');
  });

  it('always prefers camel case', function() {
    client.context['app-claims'].should.equal('camelClaims');
    client.context['user-claims'].should.equal('camelClaims');
  });

  it('prefers the special use cases tenantId, siteId, catalogId, masterCatalogId', function() {
    client.context['tenant'].should.equal('lower-tenant');
    client.context['site'].should.equal('camelId');
    client.context['catalog'].should.equal('camelId');
    client.context['master-catalog'].should.equal('camelId');
  })
  
});