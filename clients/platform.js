
var Client = require('../client');
module.exports = Client.sub({
	"adminuser": require('./platform/adminuser'),
	"appdev": require('./platform/appdev'),
	"application": require('./platform/application'),
	"applications": require('./platform/applications'),
	"developer": require('./platform/developer'),
	"entityList": require('./platform/entityList'),
	"entitylists": require('./platform/entitylists'),
	"extensions": require('./platform/extensions'),
	"referenceData": require('./platform/referenceData'),
	"secureAppData": require('./platform/secureAppData'),
	"siteData": require('./platform/siteData'),
	"tenant": require('./platform/tenant'),
	"tenantData": require('./platform/tenantData'),
	"tenantExtensions": require('./platform/tenantExtensions'),
	"userData": require('./platform/userData')
});

