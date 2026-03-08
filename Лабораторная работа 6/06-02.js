var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dianapodshivalenko2@gmail.com',
        pass: 'ojse eaul ocoh lrni'    
    }
});

var server = http.createServer(function(req,res){
    if(url.parse(req.url).pathname === '/' && req.method === 'GET'){
        let html = fs.readFileSync('./first.html');
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(html);
    }
    else if(url.parse(req.url).pathname === '/send' && req.method === 'POST'){
        var buf = '';
        req.on('data', function(data){
            buf += data;
        });
        req.on('end', function(){
            var dataFromform = qs.parse(buf);
            var sender = dataFromform.sender;
            var receiver = dataFromform.receiver;
            var message = dataFromform.message;

            var mailOptions = {
                from: sender,
                to: receiver,
                subject: 'Test 06-02.js',
                text: message,
                html: '<p>' + message + '</p>'
            };
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log('Ошибка отправки:', err);
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end('<h1>Ошибка отправки письма</h1><p>' + err.message + '</p><a href="/">Назад</a>');
                } else {
                    console.log('Письмо отправлено:', info.response);
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end('<h1>Письмо успешно отправлено!</h1><p>ID: ' + info.messageId + '</p><a href="/">Назад</a>');
                }
            });
        });
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        res.end('<h1>Страница не найдена</h1>');
    }
}).listen(5000);