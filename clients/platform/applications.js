
var Client = require('../../client');
module.exports = Client.sub({
	"authTicket": require('./applications/authTicket')
});

