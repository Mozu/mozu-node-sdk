'use strict';
/**
 * Memoized function to turn URI Template text strings into Template objects.
 *
 * Assumes that unescaped URI Template variables are required,
 * since they're always base URLs in the current codegen.
 *
 * @param {String} templateText The URI template string.
 * @returns {Template} Object with a `render` method and a `keysUsed` object.
 */

let expRe = /\{.+?\}/g;
let varnameRe = /[\w_-]+/;
function findKeys(rawTpt) {
  let matches = rawTpt.match(expRe);
  if (!matches) return [];
  return matches.map(x => x.match(varnameRe)[0]);
}

const uritemplate = require('uri-template');
let cache = {};
module.exports = function(templateText) {
  if (cache[templateText]) {
    return cache[templateText];
  }
  let tpt = uritemplate.parse(templateText);
  return cache[templateText] = {
    render: x => tpt.expand(x),
    keysUsed: findKeys(templateText)
  };
};
