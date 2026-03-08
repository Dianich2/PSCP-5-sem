const rpcWSC = require('rpc-websockets').Client;
const wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', () => {
    process.stdin.on('data', (data) => {
        const cmd = data.toString().trim();

        switch (cmd) {
            case 'A':
                wsC.notify('A', { msg: 'Hello from A' });
                break;

            case 'B':
                wsC.notify('B', { msg: 'Hello from B' });
                break;

            case 'C':
                wsC.notify('C', { msg: 'Hello from C' });
                break;

            default:
                console.log('Enter A, B or C');
        }
    });
});
