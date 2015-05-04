
module.exports = function(Client){
	return Client.sub({
		"string": require('./merchants/string')(Client)
	});
};

