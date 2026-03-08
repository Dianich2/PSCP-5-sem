var http = require('http');

http.createServer((req, res) =>{
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.end('req.url: ' + req.url);
}).listen(3000);