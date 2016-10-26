'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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