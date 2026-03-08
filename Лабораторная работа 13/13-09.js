const udp = require('dgram')
const port = 2000;

let server = udp.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    console.log('Message from client: ' + msg);
    server.send('ECHO: ' + msg, rinfo.port);
});

server.bind(port);
