
var Client = require('../../../client');
module.exports = Client.sub({
	"card": require('./accounts/card'),
	"customerAttribute": require('./accounts/customerAttribute'),
	"customerContact": require('./accounts/customerContact'),
	"customerNote": require('./accounts/customerNote'),
	"customerSegment": require('./accounts/customerSegment'),
	"transaction": require('./accounts/transaction')
});

