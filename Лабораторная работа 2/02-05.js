var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    if(request.url === '/fetch'){
        const filename = './fetch.html';
         fs.readFile(filename, function(error, data){
                        if(error){
                            response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                            response.end('Ошибка: не получилось прочитать файл');
                        }
                        else{
                            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            response.end(data)
                        }
                        });
    }
    else if(request.url === '/api/name'){
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Подшиваленко Диана Игоревна');
    }
    else{
         response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Ошибка: страница не найдена');
    }

}).listen(5000);