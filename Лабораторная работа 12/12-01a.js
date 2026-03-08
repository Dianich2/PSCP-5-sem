const rpcWSC = require('rpc-websockets').Client;
const wsC = new rpcWSC('ws://localhost:5000');

wsC.on('open', () => {
    wsC.subscribe('event');

    wsC.on('event', (params) => {
        console.log('event:', params);
    });
});
