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
    const quer = parsedUrl.query;
    const parm = quer.k;
    if(route == '/fact' && parm != 'x'){
        if(parm != null && Number.isInteger(parseInt(parm, 10))){
            const buf = parseInt(parm, 10);
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(JSON.stringify({k:buf, fact:fact(buf)}));
        }
    }
    else if(route === '/' && parm != null && parm == 'x'){
        const html = fs.readFileSync('./03-03.html', 'utf-8');
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(html);
    }
    else{
        response.writeHead(404, {'Content-Type':'text/html'});
        response.end('<h2>Error: not found</h2>');
    }
}).listen(5000, ()=>'Server is running at http://localhost:5000');
