var http = require('http');
var query = require('querystring');
var url = require('url');

http.createServer((req, res) =>{
    let parms = url.parse(req.url, true).query;
    let allParms = '';
    for(key in parms){
        allParms += `${key}=${parms[key]} `;
    }
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.end(allParms);
}).listen(3000);