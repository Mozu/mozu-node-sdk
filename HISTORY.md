[0.10.0](https://github.com/Mozu/mozu-node-sdk/releases/tag/v0.10.0) / 2015-02-16
-------------------------------------------------------------------------------------
*   **Changed** Removed accessors for context. Just manipulate the `context` object directly. instead of calling `client.setTenant()` or `client.getTenant()`, just access the `client.context.tenant` property.
*   **Added** Correctly call the GetTenant endpoint to acquire the tenant pod URL.

[0.9.4](https://github.com/Mozu/mozu-javascript-sdk/releases/tag/v0.9.4) / 2015-02-12
-------------------------------------------------------------------------------------
*   **Fixed** Bad repository URL in `package.json`.

[0.9.3](https://github.com/Mozu/mozu-javascript-sdk/releases/tag/v0.9.3) / 2015-01-28
-------------------------------------------------------------------------------------

*   **Changed** Security methods now use appKey instead of legacy appId, resolving an issue where devAccountNamespace was null

[0.9.2](https://github.com/Mozu/mozu-javascript-sdk/releases/tag/v0.9.2) / 2015-01-06
-------------------------------------------------------------------------------------

*   **Added** Security methods for testing SHA hashes
*   **Changed** Made testing pattern more modular
*   **Removed** Nock-generated test fixtures, which were more trouble than they were worth.
*   **Changed** Stopped all calls from automatically including user claims.
*   **Changed** Updated how the tenant URL is generated.

[0.9.1](https://github.com/Mozu/mozu-javascript-sdk/releases/tag/v0.9.1) / 2014-09-02
-------------------------------------------------------------------------------------

*   **Changed** Everything. Ground-up rewrite to resemble the other SDKs more. 
*   **Changed** Client methods changed to return flat JSON instead of rich objects.
*   **Added** Authentication management.
*   **Added** Code generation with CodeZu.
*   **Added** Testing with Mocha and Nock.

[0.3.0](https://github.com/Mozu/mozu-javascript-sdk/releases/tag/v0.3.0) / 2014-01-20
-------------------------------------------------------------------------------------

*   **Added** Put on Github
*   **Changed** Build process refactored to use browserify
*   **Changed** As a result of above, SDK is now compatible with NodeJS >=0.10
*   **Changed** Cart summary turned into its own type instead of a method on Cart
