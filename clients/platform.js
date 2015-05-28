var Client = require('../client');

module.exports = Client.sub({
	"adminuser": require('./platform/adminuser'),
	"application": require('./platform/application'),
	"applications": require('./platform/applications'),
	"developer": require('./platform/developer'),
	"entityList": require('./platform/entityList'),
	"entitylists": require('./platform/entitylists'),
	"referenceData": require('./platform/referenceData'),
	"siteData": require('./platform/siteData'),
	"tenant": require('./platform/tenant'),
	"tenantData": require('./platform/tenantData'),
	"tenantExtensions": require('./platform/tenantExtensions'),
	"userData": require('./platform/userData')
});