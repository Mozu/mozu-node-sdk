
var Client = require('../client');
module.exports = Client.sub({
	"documentDraftSummary": require('./content/documentDraftSummary'),
	"documentList": require('./content/documentList'),
	"documentlists": require('./content/documentlists'),
	"documentListType": require('./content/documentListType'),
	"documentType": require('./content/documentType'),
	"propertyType": require('./content/propertyType'),
	"publishSetSummary": require('./content/publishSetSummary')
});

