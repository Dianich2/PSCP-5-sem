var ws = require('ws');
var http = require('http');
var fs = require('fs');     
const { unref } = require('process');

var httpServer = http.createServer((req, res) =>{
    if(req.method == 'GET' && req.url == '/start'){
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('10-01.html'));
    }
    else{
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('ERROR');
    }
}).listen(3000);

var wsserver = new ws.Server({ port: 4000, host: 'localhost'});

wsserver.on('connection', function(ws) {
    let clientMessageNum = 0;
    let serverMessageNum = 0;
    let intervalId;
    ws.on('message', function(message) {
        console.log('received message: %s', message);
        const match = message.toString().match(/10-01-client: (\d+)/);
        if (match) {
            clientMessageNum = parseInt(match[1]);
        }
    });
    intervalId = setInterval(() => {
        serverMessageNum++;
        ws.send(`10-01-server: ${clientMessageNum}->${serverMessageNum}`);
    }, 5000);

    ws.on('close', function() {
        clearInterval(intervalId);
    });
});
