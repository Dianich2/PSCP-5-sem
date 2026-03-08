var http = require('http');
var query = require('querystring');
var url = require('url');
var xml2js = require('xml2js');
var xmlbuilder = require('xmlbuilder');

let handler = (req, res) =>{
    if(req.method == 'GET'){
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.end('GET');
    }
    else if(req.method == 'POST'){
        let chunks = [];
        req.on('data', function(data) {
            chunks.push(data);
        });
        req.on('end', function() {
            let body = Buffer.concat(chunks);
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(body);         
        });
    }
}

let server = http.createServer().listen(3000)
.on('request', handler);