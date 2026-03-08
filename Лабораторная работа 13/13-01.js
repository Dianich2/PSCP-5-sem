const net = require('net');

let host = '0.0.0.0';
let port = 2000;

net.createServer((sock)=>{
    sock.on('data', (data)=>{
        console.log('Message from client: ' + data.toString());
        sock.write('ECHO: ' + data.toString());
    });

}).listen(port, host);