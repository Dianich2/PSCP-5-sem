const net = require('net')

let host = '0.0.0.0'
let port = process.argv[2] ? process.argv[2] : 40000;

let client = new net.Socket();
let buf = Buffer.alloc(4);
let numParm = parseInt(process.argv[3]);

let timerId = null;

client.connect(port, host, ()=>{
    timerId = setInterval(() => {
        buf.writeInt32LE(numParm, 0);
        client.write(buf);
    }, 1000);
    setTimeout(() => {
        clearInterval(timerId);
        client.end();
    }, 20000);
});

client.on('data', (data) => {
    console.log('Message from server: ' + data);
});


client.on('close', () => {
    console.log('Connection closed');
});
