'use strict';
const scopes = require('../../constants').scopes;

/**
 * From a given prerequisite state object (config, options, requestConfig)
 * return scope.
 */

module.exports = function(state) {
  let requestConfig = state.requestConfig;
  let options = state.options;

  if (options && options.scope) {
    if (scopes[options.scope]) {
      return scopes[options.scope];
    } else {
      return options.scope;
    }
  } else {
    return requestConfig.scope;
  }
};
