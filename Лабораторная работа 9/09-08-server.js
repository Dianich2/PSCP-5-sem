var http = require('http');
var query = require('querystring');
var url = require('url');
var fs = require('fs');

let handler = (req, res) =>{
    var path = url.parse(req.url, true).pathname;
    var parts = path.split('/').filter(p => p != '');
        var filePath = parts[0];
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Файл не найден');
                return;
            }

            var ext = parts[0].split('.').pop().toLowerCase();
            var mimeTypes = {
                'html': 'text/html',
                'css': 'text/css',
                'js': 'text/javascript',
                'json': 'application/json',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'txt': 'text/plain'
            };
            var contentType = mimeTypes[ext] || 'application/octet-stream';

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                    res.end('Ошибка чтения файла');
                    return;
                }

                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Content-Length': data.length
                });
                res.end(data);
            });
        });
}

let server = http.createServer().listen(3000)
.on('request', handler);