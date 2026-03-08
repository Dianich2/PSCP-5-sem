var http = require('http');
var fs = require('fs');
var url = require('url');

function fact(a){
    if(a == 0 || a == 1){
        return 1;
    }
    return a * fact(a - 1);
}

http.createServer(function(request, response){
    const parsedUrl = url.parse(request.url, true);
    const route = parsedUrl.pathname;
    if(route == '/fact'){
        const quer = parsedUrl.query;
        const parm = quer.k;
        if(parm != null && Number.isInteger(parseInt(parm, 10))){
            const buf = parseInt(parm, 10);
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(JSON.stringify({k:buf, fact:fact(buf)}));
        }
        else{
            response.writeHead(400, {'Content-Type':'text/html'});
            response.end('<h2>Error: invalid parm</h2>');
        }
    }
    else{
        response.writeHead(404, {'Content-Type':'text/html'});
        response.end('<h2>Error: not found</h2>');
    }
}).listen(5000, ()=>'Server is running at http://localhost:5000');
