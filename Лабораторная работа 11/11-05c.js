const rpcWSC = require('rpc-websockets').Client;
const async = require('async');
const wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', async () => {
    try {
        await wsC.login({ login: 'dianich', password: '222' });
        console.log(await wsC.call('sum', [await wsC.call('sum', 
            [await wsC.call('square', [3]), await wsC.call('square', [5, 4]), await wsC.call('mul', [3, 5, 7, 9, 11, 13])]), 
            await wsC.call('mul', [await wsC.call('fib', 7), await wsC.call('mul', [2, 4, 6])])
        ]));
    } 
    catch (err) {
        console.error("RPC error:", err);
    }
});
