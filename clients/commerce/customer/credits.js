
var Client = require('../../../client');
module.exports = Client.sub({
	"creditAuditEntry": require('./credits/creditAuditEntry'),
	"creditTransaction": require('./credits/creditTransaction')
});

