var assert = require('assert');

function isExpired(ticket) {
  var ungraceperiod = 60000;
  var compareDate = new Date();
  compareDate.setTime(compareDate.getTime() + ungraceperiod);
  return (new Date(ticket.refreshTokenExpiration)) < compareDate;
}

function generateCacheKey(claimtype, context) {
  assert(context.appKey, "No application key in context!");
  var cmps = [context.appKey];
  switch(claimtype) {
    case "developer":
      assert(context.developerAccountId, "No developer account id in context!");
      assert(context.developerAccount && context.developerAccount.emailAddress, "No developer account email address in context!");
      cmps.push(context.developerAccountId, context.developerAccount.emailAddress);
      break;
    case "admin-user":
      assert(context.tenant, "No tenant in context!");
      assert(context.adminUser && context.adminUser.emailAddress, "No admin user email address in context!");
      cmps.push(context.tenant, context.adminUser.emailAddress);
      break;
    default:
      break;
  }
  return cmps.join();
}

module.exports = function() {
  var claimsCaches = {
    application: {},
    developer: {},
    'admin-user': {}
  };

  return {
    get: function(claimtype, context, callback) {
      setImmediate(function() {
        var ticket = claimsCaches[claimtype][generateCacheKey(claimtype, context)];
        callback(null, ticket && !isExpired(ticket) && ticket || undefined);
      });
    },
    set: function(claimtype, context, ticket, callback) {
      claimsCaches[claimtype][generateCacheKey(claimtype, context)] = ticket;
      setImmediate(callback);
    }
  }
};