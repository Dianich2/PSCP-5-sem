const net = require('net')

let host = '0.0.0.0'
let port = 4000

let client = new net.Socket();
let buf = Buffer.alloc(4);

let timerId = null;

client.connect(port, host, ()=>{
    let num = 0;
    timerId = setInterval(() => {
        client.write((buf.writeInt32LE(num++, 0), buf))
    }, 1000);
    setTimeout(() => {
        clearInterval(timerId);
        client.end();
    }, 20000);
});

client.on('data', (data) => {
    console.log('Sum from server: ' + data.readInt32LE());
});



