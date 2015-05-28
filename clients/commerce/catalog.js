
var Client = require('../../client');
module.exports = Client.sub({
	"admin": require('./catalog/admin'),
	"storefront": require('./catalog/storefront')
});

