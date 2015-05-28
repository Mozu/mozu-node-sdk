
var Client = require('../../client');
module.exports = Client.sub({
	"location": require('./admin/location'),
	"locationType": require('./admin/locationType')
});

