var http = require('http');
var query = require('querystring');
var url = require('url');

let handler = (req, res) =>{
    if(req.method == 'GET'){
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.end('GET');
    }
    else if(req.method == 'POST'){
        let p = '';
        req.on('data', (chunk) =>{
            p += chunk;
        });

        req.on('end', () =>{
            let parms = query.parse(p);
            p += '\n';
            for(key in parms){
                p += `${key}=${parms[key]} `;
            }
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(p);
        });
    }
}

let server = http.createServer().listen(3000)
.on('request', handler);