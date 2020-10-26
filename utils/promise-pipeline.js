'use strict';

module.exports = function promisePipeline(tasks) {
  return tasks.reduce(function (p, task) {
    return p.then(task);
  }, Promise.resolve());
};