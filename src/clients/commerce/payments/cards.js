
module.exports = function(Client){
	return Client.sub({
		"publicCard": require('./cards/publicCard')(Client)
	});
};

