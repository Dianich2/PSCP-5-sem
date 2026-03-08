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
        var buf = '';
        req.on('data', function(data) {
            buf += data;
        });
        req.on('end', function() {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(buf);         
        });
    }
}

let server = http.createServer().listen(3000)
.on('request', handler);