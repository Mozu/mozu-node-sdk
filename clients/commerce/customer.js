
var Client = require('../../client');
module.exports = Client.sub({
	"accounts": require('./customer/accounts'),
	"addressValidationRequest": require('./customer/addressValidationRequest'),
	"attributedefinition": require('./customer/attributedefinition'),
	"credit": require('./customer/credit'),
	"credits": require('./customer/credits'),
	"customerAccount": require('./customer/customerAccount'),
	"customerAuthTicket": require('./customer/customerAuthTicket'),
	"customerSegment": require('./customer/customerSegment'),
	"visit": require('./customer/visit')
});

