const { timeStamp } = require('console');
const fs = require('fs');
const WebSocket = require('ws');

const wsS = new WebSocket.Server({ port: 4000, host:'localhost' });

wsS.on('connection', (ws) => {
  let numMessage = 0;

  ws.on('message', (data) => {
    numMessage++;
    let d = JSON.parse(data);
    console.log('Message from client: \n', d);
    ws.send(JSON.stringify({server: numMessage, client:d.client, timeStamp: new Date()}));
  });
  
  
});


