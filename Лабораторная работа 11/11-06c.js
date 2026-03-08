const rpcWSC = require('rpc-websockets').Client;
const wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', async () => {
    wsC.subscribe('C');
    wsC.on('C', (data) => {
        console.log('C:', data);
    });
});
