var http = require('http');
var query = require('querystring');
var xmlb = require('xmlbuilder');
var parseS = require('xml2js').parseString;

let parms = xmlb.create('request').att('id', '28');
parms.ele('x').att('value', '1');
parms.ele('x').att('value', '2');
parms.ele('m').att('value', 'a');
parms.ele('m').att('value', 'b');
parms.ele('m').att('value', 'c');

let options = {
    host: 'localhost',
    path: `/`,
    port: 3000,
    method: 'POST',
    headers:{
        'content-type': 'text/xml', 'accept': 'text/xml'
    }
};

const request = http.request(options, (response) =>{
    let body = '';
    response.on('data', (chunk) =>{
        body += chunk;
    });

    response.on('end', () => {
        console.log('Status code: ' + response.statusCode);
        console.log(body);
    })
});

request.end(parms.toString({pretty:true}));