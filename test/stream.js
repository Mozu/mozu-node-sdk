var setup = require('./utils/config');
var concatStream = require('concat-stream');
var when = require('when');

xdescribe('Stream instead of promise mode', function() {

  before(setup);
  
  this.timeout(20000);

  it('available if { stream: true } is passed as a request option', function(done) {

    var tenantStream = setup.client.platform().tenant().getTenant({
      tenantId: setup.client.context.tenant
    },
    {
      stream: true
    });

    tenantStream.should.respondTo('pipe');

    tenantStream.pipe(concatStream(function(res) {
      res.should.have.property('domain');
      res.should.have.property('id',2628);
      res.should.have.property('sites').should.have.property('length');
      done(true); 
    }));

  });
});