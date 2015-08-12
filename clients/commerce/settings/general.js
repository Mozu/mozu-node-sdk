
var Client = require('../../../client');
module.exports = Client.sub({
	"customRouteSettings": require('./general/customRouteSettings'),
	"taxableTerritory": require('./general/taxableTerritory')
});

