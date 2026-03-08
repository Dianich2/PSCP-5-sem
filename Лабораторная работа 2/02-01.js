var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    if(request.url === '/html'){
        fs.readFile('./index.html', function(error, html){
            if(error){
                response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end('Ошибка: не получилось прочитать файл');
            }
            else{
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(html);
            }
        });
    }
    else{
         response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Ошибка: страница не найдена');
    }

}).listen(5000);