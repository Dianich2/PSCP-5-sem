const net = require('net')

let host = '0.0.0.0'
let port = 40000
let port2 = 50000
let h = (n)=>{return (socket)=>{
    socket.on('data', (data) => {
        socket.write(`ECHO${n}: ${data.readInt32LE(0)}`);
    });
}};

net.createServer(h(1)).listen(port, host);
net.createServer(h(2)).listen(port2, host);
