var setupChai = require('./utils/setup-assertion-library');

describe('Content service', function() {

  before(setupChai);
  
  this.timeout(20000);
  var opts = {
    pageSize: 5,
    documentListName: "files@mozu"
  };

  it('returns Documents from Content.GetDocuments()', function(done) {
    return setup.client.content().documentlists().document().getDocuments(opts)
      .should.eventually.have.property('items')
      //.of.length(opts.pageSize)
      .notify(done);
  });
  
});
