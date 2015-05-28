
var Client = require('../../../../../client');
module.exports = Client.sub({
	"attributeLocalizedContent": require('./attributes/attributeLocalizedContent'),
	"attributeTypeRule": require('./attributes/attributeTypeRule'),
	"attributeVocabularyValue": require('./attributes/attributeVocabularyValue')
});

