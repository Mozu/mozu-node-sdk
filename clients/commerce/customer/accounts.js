
var Client = require('../../../client');
module.exports = Client.sub({
	"card": require('./accounts/card'),
	"customerAttribute": require('./accounts/customerAttribute'),
	"customerAuditEntry": require('./accounts/customerAuditEntry'),
	"customerContact": require('./accounts/customerContact'),
	"customerNote": require('./accounts/customerNote'),
	"customerPurchaseOrderAccount": require('./accounts/customerPurchaseOrderAccount'),
	"customerSegment": require('./accounts/customerSegment'),
	"transaction": require('./accounts/transaction')
});

