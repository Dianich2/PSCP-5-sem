const rpcWSC = require('rpc-websockets').Client;

const wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', async () => {
    try {
        console.log(await wsC.call('square', [3]));
        console.log(await wsC.call('square', [5, 4]));

        console.log(await wsC.call('sum', [2]));
        console.log(await wsC.call('sum', [2, 4, 6, 8, 10]));

        console.log(await wsC.call('mul', [3]));
        console.log(await wsC.call('mul', [3, 5, 7, 9, 11, 13]));

        const login = await wsC.login({ login: 'dianich', password: '222' });
        console.log('auth:', login);

        console.log(await wsC.call('fib', 1));
        console.log(await wsC.call('fib', 2));
        console.log(await wsC.call('fib', 7));

        console.log(await wsC.call('fact', 0));
        console.log(await wsC.call('fact', 5));
        console.log(await wsC.call('fact', 10));

    } catch (err) {
        console.error("RPC error:", err);
    }
});