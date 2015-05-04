
module.exports = function(Client){
	return Client.sub({
		"cards": require('./payments/cards')(Client),
		"merchants": require('./payments/merchants')(Client),
		"publicCard": require('./payments/publicCard')(Client)
	});
};

