'use strict';
module.exports = function extend(target) {
  return Array.prototype.slice.call(arguments,1).reduce(function(out, next) {
    if (next && typeof next === "object") {
      Object.keys(next).forEach(function(k) {
        out[k] = next[k];
      });
    }
    return out;
  }, target);
};
