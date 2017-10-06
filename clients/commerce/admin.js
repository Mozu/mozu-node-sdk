
var Client = require('../../client');
module.exports = Client.sub({
	"location": require('./admin/location'),
	"locations": require('./admin/locations'),
	"locationType": require('./admin/locationType')
});

