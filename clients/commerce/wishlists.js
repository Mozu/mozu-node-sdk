
var Client = require('../../client');
module.exports = Client.sub({
	"wishlistItem": require('./wishlists/wishlistItem')
});

