var http = require('http');

let options = {
    host: 'localhost',
    path: '/',
    port: 3000,
    method: 'GET'
};

const request = http.request(options, (response) =>{
    console.log('Status code: ' + response.statusCode);
    console.log('Status message: ' + response.statusMessage);
    console.log('Server address: ' + response.socket.remoteAddress);
    console.log('Server port: ' + response.socket.remotePort);
    
    let body = '';
    response.on('data', (chunk) =>{
        body += chunk.toString();
    });

    response.on('end', () => {
        console.log('Response body: ' + body);
    })
});

request.end();