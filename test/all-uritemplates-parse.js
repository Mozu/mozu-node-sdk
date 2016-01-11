'use strict';
var fs = require('fs');
var test = require('tape');
var acorn = require('acorn');
var acornWalk = require('acorn/dist/walk');
var glob = require('glob');
var getUriTemplate = require('../utils/get-url-template');

test('all uri templates in autogenned code are parseable', function(assert) {
  var allClients = glob.sync('./clients/**/*.js');
  assert.plan(allClients.length);
  allClients.forEach(function(f) {
    var t = acorn.parse(fs.readFileSync(f, 'utf8'));
    var badness = '';
    acornWalk.simple(t, {
      Property: function(n) {
        if (n.key && n.key.name === 'url') {
          try {
            getUriTemplate(n.value.value);
          } catch(e) {
            badness += 
              '\n\nuri template "' + n.value.value + '" does not parse in ' +
                f + ', with error: ' + e;
          }
        }
      }
    });
  assert.notOk(badness, badness || 'uri templates good in ' + f);
  });
});
