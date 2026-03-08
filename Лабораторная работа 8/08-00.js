var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
var xml2js = require('xml2js');
var xmlbuilder = require('xmlbuilder');
var mp = require('multiparty');

var ws;
const parser = new xml2js.Parser();

var server = http.createServer(function(req, res){
    var path = url.parse(req.url, true).pathname;
    var quer = url.parse(req.url, true).query;
    if(path == '/connection'){
        if(quer.set){
            var p = parseInt(quer.set, 10);
            server.keepAliveTimeout = p;
            console.log(server.keepAliveTimeout);
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('New KeepAliveTimeout = ' + server.keepAliveTimeout);
            return;
        }
        else{
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('KeepAliveTimeout = ' + server.keepAliveTimeout);
            return;
        }
    }
    else if(path == '/headers'){
        var buf = 'Заголовки запроса:\n';
        for(key in req.headers) buf += `${key}:${req.headers[key]}\n`;
        buf += 'Заголовки ответа:\n';
        res.setHeader('X-fist', 'first');
        res.setHeader('X-second', 'second');
        var responseHeaders = res.getHeaders();
        for(key in responseHeaders) {
            buf += `${key}: ${responseHeaders[key]}\n`;
        }
        buf += 'Content-Type: text/plain; charset=utf-8\n';
        res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
        res.end(buf);
        return;
    }
    else if(path === '/parameter'){
        if(quer.x && quer.y){
                var x = parseFloat(quer.x);
                var y = parseFloat(quer.y);
                if(!isNaN(x) && !isNaN(y)){
                    res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
                    var buf =  `Сумма x и y = ${(x + y)}\nРазность x и y =  ${(x - y)}\nПроизведение x и y = ${(x * y)}\nЧастное x и y = ${(x / y)}\n`;
                    res.end(buf);
                    return;
                }
                else{
                    res.writeHead(400, {'Content-Type':'text/plain; charset=utf-8'});
                    res.end('Ошибка: x и y должны быть числами');
                    return;
                }
        }
        else{
            res.writeHead(400, {'Content-Type':'text/plain; charset=utf-8'});
            res.end('Ошибка: x и y должны быть заданы');
            return;
        }
    }
    else if(path.startsWith(`/parameter/`)){
        var parts = path.split('/').filter(p => p != '');
        if(parts.length != 3){
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end('URI: ' + req.url);
            return;
        }
        var x = parseFloat(parts[1]);
        var y = parseFloat(parts[2]);
        if(!isNaN(x) && !isNaN(y)){
            res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
            var buf =  `Сумма x и y = ${(x + y)}\nРазность x и y =  ${(x - y)}\nПроизведение x и y = ${(x * y)}\nЧастное x и y = ${(x / y)}\n`;
            res.end(buf);
            return;
        }
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('URI: ' + req.url);
        return;
    }
    else if(path == '/close'){
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Сервер закроется через 10 секунд');
        setTimeout(()=>{
            server.close();
            process.exit(0);
        }, 10000);
        return;
    }
    else if(path == '/socket'){
        var buf = `IP сервера: ${ws.localAddress}\nПорт сервера: ${ws.localPort}\nIP клиента: ${ws.remoteAddress}\nПорт клиента: ${ws.remotePort}\n`;
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end(buf);
        return;
    }
    else if(path == '/req-data'){
        var buf = '';
        var i = 0;
        req.on('data', (data)=>{
            buf += `${data}\n`;
            i++;
        });
        req.on('end', ()=>{
            buf += `Всего пришло чанков: ${i}`;
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(buf);
        })
    }
    else if(path == '/resp-status'){
        var search = url.parse(req.url, true).search.split('?').filter(p => p != '');
        var fistparm = search[0].slice(search[0].indexOf('=') + 1, search[0].length);
        var secondparm = search[1].slice(search[1].indexOf('=') + 1, search[1].length);
        res.statusCode = parseInt(fistparm);
        res.statusMessage = secondparm;
        res.end(`${res.statusCode}: ${res.statusMessage}`);
        return;
    }
    else if(path == '/formparameter'){
        if(req.method === 'GET'){
            var html = fs.readFileSync('./09-form.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html);
        }
        else if(req.method === 'POST'){
            var buf = '';
            req.on('data', function(data) {
                buf += data;
            });
        
            req.on('end', function() {
                var formData = qs.parse(buf);
                var result = 'Полученные параметры формы:\n\n';

                result += `Текстовое поле: ${formData.fir || 'не указано'}\n`;
                result += `Числовое поле: ${formData.sec || 'не указано'}\n`;
                result += `Поле даты: ${formData.thi || 'не указано'}\n`;
                
                if(formData.fou) {
                    if(Array.isArray(formData.fou)) {
                        result += `Чекбоксы: ${formData.fou.join(', ')}\n`;
                    } else {
                        result += `Чекбоксы: ${formData.fou}\n`;
                    }
                } else {
                    result += `Чекбоксы: не выбраны\n`;
                }

                result += `Радиокнопки : ${formData.fif || 'не выбран'}\n`;

                result += `Текстовое поле (textarea): ${formData.six || 'не указано'}\n`;

                result += `Нажатая кнопка: ${formData.action || 'не определена'}\n\n`;

                result += '\n\n<a href="/formparameter">Вернуться к форме</a>';

                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`<html><body><pre>${result}</pre></body></html>`);
            });
        }
    }
    else if(path == '/json'){
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
    else if(path == '/xml'){
        var buf = '';
        req.on('data', function(data) {
            buf += data;
        });
        req.on('end', function() {
            var sumX = 0;
            var concM = '';
            var reqId;
            parser.parseString(buf, (err, result) =>{
                result.request.x.forEach(function(xElem) {
                    sumX += parseInt(xElem.$.value) || 0;
                });
                result.request.m.forEach(function(mElem) {
                    concM += mElem.$.value || '';
                });
                reqId = result.request.$.id;
                var xmlRes = xmlbuilder.create('response').att('id', '33').att('request', `${reqId}`);
                xmlRes.ele('sum').att('element', 'x').att('result', `${sumX}`);
                xmlRes.ele('concat').att('element', 'm').att('result', `${concM}`);
                res.writeHead(200, {'Content-Type': 'application/xml; charset=utf-8'});
                res.end(xmlRes.toString({pretty:true}));
            });
        });
    }
    else if(path == '/files'){
        var count = fs.readdirSync('./static').length;
        res.setHeader('X-static-files-count', `${count}`);
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end(`X-static-files-count: ${count}`);
    }
    else if(path.startsWith(`/files/`)){
         var parts = path.split('/').filter(p => p != '');
        if(parts.length != 2){
            res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end('Bad request');
            return;
        }
        var filePath = './static/' + parts[1];
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Файл не найден');
                return;
            }

            var ext = parts[1].split('.').pop().toLowerCase();
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
    else if(path == '/upload'){
        if(req.method === 'GET'){
            var html = fs.readFileSync('./14-form.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html);
        }
        else if(req.method === 'POST'){
            var buf = '<h1>';
            let form = new mp.Form({uploadDir:'./static'});
            form.on('file', (name, file) =>{
                buf += `${name} = ${file.originalFilename}</h2>`
            });
            form.on('field', function(name, value) {
                console.log(`Поле "${name}": ${value}`);
            });
            form.on('close', () =>{
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(buf);
                return;
            });
            form.parse(req);
        }
    }
}).listen(5000);

server.on('connection', (sock)=>{
    ws = sock;
})