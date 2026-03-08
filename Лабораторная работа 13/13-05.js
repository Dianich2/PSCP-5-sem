const net = require('net')

let host = '0.0.0.0'
let port = 4000

let server = net.createServer();

server.on('connection', (socket) => {
    console.log('Client connected');
    let sum = 0;
    socket.on('data', (data) => {
        sum += data.readInt32LE();
    });

    let buf = Buffer.alloc(4);

    setInterval(() => {
        buf.writeInt32LE(sum);
        socket.write(buf);
    }, 5000);

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, host);
