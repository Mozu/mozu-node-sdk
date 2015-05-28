
var Client = require('../../client');
module.exports = Client.sub({
	"entity": require('./entitylists/entity'),
	"entityContainer": require('./entitylists/entityContainer'),
	"listView": require('./entitylists/listView')
});

