
var Client = require('../../client');
module.exports = Client.sub({
	"adminUser": require('./adminuser/adminUser'),
	"role": require('./adminuser/role'),
	"tenantAdminUserAuthTicket": require('./adminuser/tenantAdminUserAuthTicket')
});

