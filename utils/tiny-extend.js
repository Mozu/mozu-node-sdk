'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = function extend(target) {
  return Array.prototype.slice.call(arguments, 1).reduce(function (out, next) {
    if (next && (typeof next === "undefined" ? "undefined" : _typeof(next)) === "object") {
      Object.keys(next).forEach(function (k) {
        out[k] = next[k];
      });
    }
    return out;
  }, target);
};