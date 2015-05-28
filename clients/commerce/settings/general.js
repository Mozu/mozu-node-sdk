
var Client = require('../../../client');
module.exports = Client.sub({
	"taxableTerritory": require('./general/taxableTerritory')
});

