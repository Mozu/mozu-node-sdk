var testContext;
try {
  testContext = require('../mozu.test.config.json');
} catch(e) {
  testContext = {
    appKey: 'nothing',
    sharedSecret: '12345',
    baseUrl: 'http://example.com',
    developerAccountId: 1,
    developerAccount: {
      emailAddress: 'test@example.com'
    },
    tenantId: 1
  };
}
module.exports = testContext;
