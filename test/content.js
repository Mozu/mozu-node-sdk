var setupChai = require('./utils/setup-assertion-library');
var proxyConf = {
  plugins: [require('../plugins/fiddler-proxy')]
};

describe('Content service', function() {

  before(setupChai);
  
  this.timeout(20000);
  var opts = {
    pageSize: 5,
    documentListName: "files@mozu"
  };

  it('returns Documents from Content.GetDocuments()', function(done) {
    return require('../clients/content/documentlists/document')(proxyConf).getDocuments(opts)
      .should.eventually.have.property('items')
      //.of.length(opts.pageSize)
      .notify(done);
  });
  
});
