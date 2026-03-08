const rpcWSS = require('rpc-websockets').Server;
const wsS = new rpcWSS({ port: 4000, host:'localhost' });

wsS.event('A');
wsS.event('B');
wsS.event('C');

process.stdin.on('data', (data)=>{
    switch(data.toString().trim()){
        case 'A':
            wsS.emit('A', 'Hello from A');
            break;
        case 'B':
            wsS.emit('B', 'Hello from B');
            break;
        case 'C':
            wsS.emit('C', 'Hello from C');
            break;
    }
})