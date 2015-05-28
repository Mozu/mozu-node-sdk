
var Client = require('../../client');
module.exports = Client.sub({
	"publicCard": require('./payments/publicCard')
});

