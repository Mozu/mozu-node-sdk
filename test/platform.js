var setupChai = require('./utils/setup-assertion-library');
var when = require('when');
var proxyConf = {
  plugins: [require('../plugins/fiddler-proxy')]
};

describe('Platform service', function() {

  before(setupChai);
  
  this.timeout(20000);

  it('returns a Tenant from GetTenant', function(done) {
    var client = require('../clients/platform/tenant')(proxyConf);
    var tenant = client.getTenant({
      tenantId: client.context.tenant
    });

    when.join(
      tenant.should.eventually.have.property('domain'),
      tenant.should.eventually.have.property('id',client.context.tenant),
      tenant.should.eventually.have.property('sites').should.eventually.have.property('length')
    ).should.notify(done);

  });
});