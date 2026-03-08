const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 5000, host: 'localhost' });
const clients = new Set();

server.on('connection', (ws) => {
    clients.add(ws);
    console.log("Client connected");

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log("Client disconnected");
    });
});