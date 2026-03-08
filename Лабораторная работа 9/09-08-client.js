var http = require('http');
var query = require('querystring');
var xmlb = require('xmlbuilder');
var parseS = require('xml2js').parseString;
var fs = require('fs');

let options = {
    host: 'localhost',
    path: `/Topla.png`,
    port: 3000,
    method: 'GET'
};

const file = fs.createWriteStream("file.bmp");

const request = http.request(options, (response) =>{
    response.pipe(file);
});

request.end();