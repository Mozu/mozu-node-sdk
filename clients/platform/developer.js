
var Client = require('../../client');
module.exports = Client.sub({
	"developerAdminUserAuthTicket": require('./developer/developerAdminUserAuthTicket')
});

