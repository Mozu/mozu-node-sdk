
var Client = require('../../client');
module.exports = Client.sub({
	"document": require('./documentlists/document'),
	"documentTree": require('./documentlists/documentTree'),
	"facet": require('./documentlists/facet'),
	"view": require('./documentlists/view')
});

