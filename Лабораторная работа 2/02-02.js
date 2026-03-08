var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    if(request.url === '/png'){
        const fname = './img/pic.png'
        fs.readFile(fname, function(error, data){
            if(error){
                response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end('Ошибка: не получилось прочитать файл');
            }
            else{
                response.writeHead(200, {'Content-Type': 'image/png'});
                response.end(data, 'binary')
            }
        });
    }
    else{
         response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Ошибка: страница не найдена');
    }

}).listen(5000);