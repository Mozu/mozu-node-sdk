
var Client = require('../../client');
module.exports = Client.sub({
	"accountattributedefinition": require('./customer/accountattributedefinition'),
	"accounts": require('./customer/accounts'),
	"addressValidationRequest": require('./customer/addressValidationRequest'),
	"attributedefinition": require('./customer/attributedefinition'),
	"b2BAccount": require('./customer/b2BAccount'),
	"credit": require('./customer/credit'),
	"credits": require('./customer/credits'),
	"customerAccount": require('./customer/customerAccount'),
	"customerAuthTicket": require('./customer/customerAuthTicket'),
	"customerSegment": require('./customer/customerSegment'),
	"customerSet": require('./customer/customerSet'),
	"visit": require('./customer/visit')
});

