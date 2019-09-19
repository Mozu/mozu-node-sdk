
var Client = require('../../client');
module.exports = Client.sub({
	"location": require('./admin/location'),
	"locationGroup": require('./admin/locationGroup'),
	"locationGroupConfiguration": require('./admin/locationGroupConfiguration'),
	"locations": require('./admin/locations'),
	"locationType": require('./admin/locationType')
});

