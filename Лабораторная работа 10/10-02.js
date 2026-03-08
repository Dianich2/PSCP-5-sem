let ws = null;
let messageCount = 0;
let sendInterval = null;
let stopTimeout = null;

ws = new WebSocket('ws://localhost:4000');

ws.onopen = function(event) {
    messageCount = 0;
    sendInterval = setInterval(() => {
        messageCount++;
        const message = `10-01-client: ${messageCount}`;
        ws.send(message);
    }, 3000);
    
    setTimeout(() => {
        clearInterval(sendInterval);
        sendInterval = null;
        ws.close(1000, 'Close socket after 25 sec');
    }, 25000);
};

ws.onmessage = function(event) {
    console.log(`Received message: ${event.data}`);
};