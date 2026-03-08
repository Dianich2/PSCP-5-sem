const net = require('net')

let host = '0.0.0.0'
let port = 4000

let client = new net.Socket();
let buf = Buffer.alloc(4);
let parm = process.argv[2];
let numParm = parseInt(parm);

let timerId = null;

client.connect(port, host, ()=>{
    timerId = setInterval(() => {
        client.write((buf.writeInt32LE(numParm, 0), buf))
    }, 1000);
    setTimeout(() => {
        clearInterval(timerId);
        client.end();
    }, 20000);
});

client.on('data', (data) => {
    console.log('Sum from server: ' + data.readInt32LE());
});



client.on('close', () => {
    console.log('Connection closed');
});
