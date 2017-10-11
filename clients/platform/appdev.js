
var Client = require('../../client');
module.exports = Client.sub({
	"appPackage": require('./appdev/appPackage'),
	"package": require('./appdev/package')
});

