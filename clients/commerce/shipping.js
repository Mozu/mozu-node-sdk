
var Client = require('../../client');
module.exports = Client.sub({
	"admin": require('./shipping/admin'),
	"global": require('./shipping/global')
});

