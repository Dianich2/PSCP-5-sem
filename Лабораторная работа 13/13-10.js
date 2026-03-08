const udp = require('dgram')
const port = 2000;

let client = udp.createSocket('udp4');

client.on('message', (msg, rinfo) => {
    console.log('Message from server: ' + msg);
    client.close();
});

client.send('Hello', port, 'localhost');
