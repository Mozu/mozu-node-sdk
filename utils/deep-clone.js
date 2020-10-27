'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  deepClone: function deepClone(inObj) {
    var outObj = void 0,
        key = void 0,
        val = void 0;

    if ((typeof inObj === 'undefined' ? 'undefined' : _typeof(inObj)) !== 'object' || inObj === null) return inObj;

    outObj = inObj instanceof Array ? [] : Object.create(Object.getPrototypeOf(inObj));

    for (key in inObj) {
      if (Object.prototype.hasOwnProperty.call(inObj, key)) {
        val = inObj[key];
        outObj[key] = deepClone(val);
      }
    }

    return outObj;
  }
};