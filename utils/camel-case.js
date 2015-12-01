'use strict';

function cccb(match, l) {
  return l.toUpperCase();
}

var rdashAlpha = /-([\da-z])/gi;

module.exports = function camelCase(str) {
  return (str.charAt(0) + str.substring(1)).replace(rdashAlpha, cccb);
};