
var Client = require('../../client');
module.exports = Client.sub({
	"credentialStoreEntry": require('./extensions/credentialStoreEntry')
});

