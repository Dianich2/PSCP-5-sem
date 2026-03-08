var http = require('http');
var query = require('querystring');
var xmlb = require('xmlbuilder');
var parseS = require('xml2js').parseString;
var fs = require('fs');

let body = `--bound--\r\n`;
body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n';
body += 'Content-Type:text/plain\r\n\r\n';
body += fs.readFileSync('MyFile.txt');
body += `\n--bound--\r\n`;

let options = {
    host: 'localhost',
    path: `/`,
    port: 3000,
    method: 'POST',
    headers:{
        'content-type': 'multipart/form-data; boundary= --bound--'
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

request.end(body);