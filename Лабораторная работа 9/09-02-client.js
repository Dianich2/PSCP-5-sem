var http = require('http');
var query = require('querystring');

let parms = query.stringify({x:2, y: 22});

let options = {
    host: 'localhost',
    path: `/?${parms}`,
    port: 3000,
    method: 'GET'
};

const request = http.request(options, (response) =>{
    console.log('Status code: ' + response.statusCode);
    
    let body = '';
    response.on('data', (chunk) =>{
        body += chunk.toString();
    });

    response.on('end', () => {
        console.log('Response body: ' + body);
    })
});

request.end();