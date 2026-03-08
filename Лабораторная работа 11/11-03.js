const fs = require('fs');
const WebSocket = require('ws');

const wsS = new WebSocket.Server({ port: 4000, host:'localhost' });

wsS.on('connection', (ws) => {
  ws.isDie = false;

  ws.on('pong', (data) => {
    ws.isDie = false;
  });
  
});
let messageNum = 0;

setInterval(() => {
  messageNum++;
  for(let client of wsS.clients){
      if(client.readyState === WebSocket.OPEN){
          client.send('11-03-server: ' + messageNum);
      }
  }
}, 15000);

setInterval(() => {
    for(let client of wsS.clients){
        if (client.isDie === true) {
            client.terminate();
            continue;
        }
        client.isDie = true;
        client.ping(); 
    }
}, 5000);

setInterval(() => {
    let liveCount = 0;
    for(let client of wsS.clients){
        if (client.isDie === false) {
            liveCount++;
        } 
    }
    console.log('Live client count: ' + liveCount);
}, 6000);
