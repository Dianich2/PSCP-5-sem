const rpcWSS = require('rpc-websockets').Server;
const wsS = new rpcWSS({ port: 4000, host:'localhost' });

wsS.register('A', (params) => {
    console.log('A:', params);
}).public();

wsS.register('B', (params) => {
    console.log('B:', params);
}).public();

wsS.register('C', (params) => {
    console.log('C:', params);
}).public();