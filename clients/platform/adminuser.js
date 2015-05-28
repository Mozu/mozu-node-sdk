
var Client = require('../../client');
module.exports = Client.sub({
	"adminUser": require('./adminuser/adminUser'),
	"tenantAdminUserAuthTicket": require('./adminuser/tenantAdminUserAuthTicket')
});

