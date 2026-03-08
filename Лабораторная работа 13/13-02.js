const net = require('net');

let host = '0.0.0.0';
let port = 2000;

let client = new net.Socket();

client.connect(port, host, ()=>{
    client.write('Hello');
});

client.on('data', (data)=>{
    console.log('Message from server: ' + data.toString());
    client.destroy();
});