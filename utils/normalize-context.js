var extend = require('./tiny-extend');

var priorities = {
  'app-claims': ['appClaims'],
  'user-claims': ['userClaims'],
  'tenant': ['tenantId'],
  'site': ['siteId'],
  'master-catalog': ['masterCatalog','masterCatalogId'],
  'catalog': ['catalogId'],
  'dataview-mode': ['dataViewMode']
};

var prioritiesKeys = Object.keys(priorities);

module.exports = function(context) {
  var newContext = extend({}, context);
  return prioritiesKeys.reduce(function(ctx, dashKey) {
    return priorities[dashKey].reduce(function(ctx, k) {
      if (k in ctx) {
        ctx[dashKey] = ctx[k];
        delete ctx[k];
      }
      return ctx;
    }, ctx);
  }, newContext);
};

// var dashedProps = Object.keys(constants.headers).map(function(k) {
//   return constants.headers[k];
// });

// var camelToDash = dashedProps.reduce(function(t, dashed) {
//   t[camelCase(dashed)] = dashed;
//   return t;
// }, {});

// var camelToDashKeys = Object.keys(camelToDash);

// var specialProps =  {
//   tenantId: 'tenant',
//   siteId: 'site',
//   catalogId: 'catalog',
//   masterCatalogId: 'master-catalog'
// }

// var specialPropsKeys = Object.keys(specialProps);

// module.exports = function normalizeContext(context) {

//   return  addSpecialProps(
//             addCamelProps(
//               addDashedProps([extend({}, context), {}])
//             )
//           );
// }

// function addDashedProps(contextPair) {
//   return dashedProps.reduce(function(pair, k) {
//     var older = pair[0],
//         newer = pair[1];
//     if (k in older) {
//       newer[k] = older[k];
//       delete older[k];
//     }
//     return [older, newer];
//   }, contextPair);
// }