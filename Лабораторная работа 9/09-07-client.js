var http = require('http');
var query = require('querystring');
var xmlb = require('xmlbuilder');
var parseS = require('xml2js').parseString;
var fs = require('fs');

let body = `--bound--\r\n`;
body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n';
body += 'Content-Type:application/octet-stream\r\n\r\n';

let options = {
    host: 'localhost',
    path: `/`,
    port: 3000,
    method: 'POST',
    headers:{
        'content-type': 'multipart/form-data; boundary=--bound--'
    }
};

const request = http.request(options, (response) =>{
    let data = [];
    response.on('data', (chunk) =>{
        data.push(chunk)
    });

    response.on('end', () => {
        let body = Buffer.concat(data);
        console.log('Status code: ' + response.statusCode);
        console.log(body.toString('base64'));
    })
});

request.write(body);
let st = new fs.ReadStream('Topla.png');
st.on('data', (chunk)=>{
    request.write(chunk);
})

st.on('end', ()=>{
    request.end(`\n--bound--\r\n`);
});