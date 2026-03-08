var http = require('http');
var query = require('querystring');
var url = require('url');

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
            var json = JSON.parse(buf);
            var jsonRes = JSON.stringify({
                "__comment": "Ответ.Лабораторная работа 8/10",
                "x_plus_y": json.x + json.y,
                "Concatinatio_s_o": `${json.s}: ${json.o.surname}, ${json.o.name}`,
                "Length_m": json.m.length
            }, null, 2);
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(jsonRes);
        });
    }
}

let server = http.createServer().listen(3000)
.on('request', handler);