const fs = require('fs');
const WebSocket = require('ws');

const wsC = new WebSocket('ws://localhost:4000');
let parm = process.argv[2];
parm = parm == undefined ? 'A' : parm;

wsC.on('open', () => {
  setInterval(() => {
    wsC.send(JSON.stringify({client: parm, timeStamp: new Date()}));
  }, 3000);

  wsC.on('message', (data) => {
    console.log('Message from server: \n', JSON.parse(data));
  });
});
