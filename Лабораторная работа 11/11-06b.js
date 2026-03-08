const rpcWSC = require('rpc-websockets').Client;
const wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', async () => {
    wsC.subscribe('B');
    wsC.on('B', (data) => {
        console.log('B:', data);
    });
});
