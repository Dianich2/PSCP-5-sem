const WebSocket = require('ws');
let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 'A' : parm;

setTimeout(() => {
    let intervalSocketSend;
    let WebSocketBroadcastClient = new WebSocket(
        'ws://localhost:5000'
    );

    WebSocketBroadcastClient.on('open', () => {
        let k = 0;

        intervalSocketSend = setInterval(() => {
            WebSocketBroadcastClient.send(`Client: ${prfx}-${++k}`);
        }, 3000);

        WebSocketBroadcastClient.on('message', (message) => {
            console.log(`Received message: ${message.toString()}`);
        });

        setTimeout(() => {
            clearInterval(intervalSocketSend);
            WebSocketBroadcastClient.close();
        }, 25000);
    });
}, 100);