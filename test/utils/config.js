module.exports = function setup() {

  var chai = require('chai');

  var client = setup.client = require('../../src/init').client();

   chai.should();
  chai.use(require('chai-as-promised'));
  if (process.env.USE_FIDDLER) {
    console.log('using fiddler proxy');
  }
}