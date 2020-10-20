'use strict';

module.exports = {
  deepClone: function deepClone (inObj) {
    let outObj, key, val;
    
    if (typeof inObj !== 'object' || inObj === null) return inObj;
    
    outObj = inObj instanceof Array ? [] : Object.create(Object.getPrototypeOf(inObj));
    
    for (key in inObj) {
      if (Object.prototype.hasOwnProperty.call(inObj, key)) {
        val = inObj[key];      
        outObj[key] = deepClone(val);
      }
    }
  
    return outObj;
  }
}