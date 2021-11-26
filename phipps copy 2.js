// var json = require('/Users/thomas.phipps/Downloads/fulfiller_swagger.json');


// qs = {}

// for (pathKey in json.paths) {
//     let pathObj = json.paths[pathKey];
//     for (methKey in pathObj) {

//         pathObj[methKey].parameters.filter(x => x.in == 'query').map(x => x.name).forEach(x => {
//             qs[x] = `${x}={${x}}`
//         })

//     }

// }

var f = 0;
var ds = doStuff()
ds.then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});



async function doStuff() {
    var client = require('./clients/commerce/catalog/admin/product')();


    var res = await client.getProducts({
        "binb":"bong"
        
    });
    return res;
}

