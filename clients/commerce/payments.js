
var Client = require('../../client');
module.exports = Client.sub({
	"fraudScreenResponse": require('./payments/fraudScreenResponse'),
	"publicCard": require('./payments/publicCard')
});

