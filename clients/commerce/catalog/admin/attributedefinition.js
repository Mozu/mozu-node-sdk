
var Client = require('../../../../client');
module.exports = Client.sub({
	"attribute": require('./attributedefinition/attribute'),
	"attributes": require('./attributedefinition/attributes'),
	"productType": require('./attributedefinition/productType'),
	"producttypes": require('./attributedefinition/producttypes')
});

