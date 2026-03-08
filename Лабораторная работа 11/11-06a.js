const rpcWSC = require('rpc-websockets').Client;
const wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', async () => {
    wsC.subscribe('A');
    wsC.on('A', (data) => {
        console.log('A:', data);
    });
});
