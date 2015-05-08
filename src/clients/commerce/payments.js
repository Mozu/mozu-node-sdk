
module.exports = function(Client){
	return Client.sub({
		"publicCard": require('./payments/publicCard')(Client)
	});
};

