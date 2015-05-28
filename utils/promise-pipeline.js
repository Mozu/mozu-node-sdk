/* global Promise */
require('when/es6-shim/Promise.browserify-es6');


module.exports = function promisePipeline(tasks) {
  return tasks.reduce(function(p, task) {
    return p.then(task);
  }, Promise.resolve());
};