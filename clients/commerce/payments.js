
var Client = require('../../client');
module.exports = Client.sub({
	"fraudScreen": require('./payments/fraudScreen'),
	"fraudScreenResponse": require('./payments/fraudScreenResponse'),
	"publicCard": require('./payments/publicCard')
});

